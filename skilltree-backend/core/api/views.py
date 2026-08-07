from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject, Topic, Profile, Resource, Bookmark, Achievement, UserAchievement, StudySession, UserTopicProgress, ChatMessage, QuizAttempt
from .services import enroll_user_in_subject, complete_topic,  unlock_achievement
from django.shortcuts import get_object_or_404
from .serializers import MyProfileSerializer, SubjectSerializer, TopicSerializer, RegisterSerializer, OnboardingSerializer, ResourceSerializer, BookmarkSerializer, AchievementSerializer, StudySessionSerializer, LeaderboardEntrySerializer, ChatMessageSerializer, QuizAttemptSerializer
from rest_framework.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from pypdf import PdfReader
from rest_framework.parsers import MultiPartParser
from .ai_services import generate_syllabus_tree, validate_topic_tree, save_generated_tree, generate_quiz, generate_topic_summary, generate_mock_exam, generate_topic_tutorial
from .tutor_service import get_tutor_response
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from collections import defaultdict
from .youtube_service import search_youtube_videos

class SubjectListView(generics.ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = getattr(user, 'profile', None)

        enrolled_subject_ids = UserTopicProgress.objects.filter(
            user=user
        ).values_list('topic__subject_id', flat=True).distinct()

        from django.db.models import Q

        # Always-visible: subjects with no scoping at all (generic/manual test subjects)
        generic_q = Q(university__isnull=True, branch__isnull=True, semester__isnull=True)

        base_q = Q(id__in=enrolled_subject_ids) | generic_q

        if profile and profile.education_type == 'college' and profile.university and profile.branch and profile.semester:
            base_q |= Q(university=profile.university, branch=profile.branch, semester=profile.semester)
            return Subject.objects.filter(base_q).distinct()

        if profile and profile.education_type == 'school':
            # School students only see enrolled + generic subjects — no college-scoped ones at all,
            # since Subject has no board/class fields to match against yet.
            return Subject.objects.filter(base_q).distinct()

        # No profile, or education_type not set/recognized — safest default: enrolled + generic only
        return Subject.objects.filter(base_q).distinct()

class TopicListView(generics.ListAPIView):
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
        return Topic.objects.filter(subject_id=subject_id)

    def get_serializer_context(self):
        return {'request': self.request}

class RegisterView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        from django.contrib.auth.models import User
        return User.objects.all()


class OnboardingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        profile = request.user.profile
        serializer = OnboardingSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, subject_id):
        subject = get_object_or_404(Subject, id=subject_id)
        created_topic_ids = enroll_user_in_subject(request.user, subject)
        return Response({
            'subject_id': subject.id,
            'topics_created': created_topic_ids,
        })

class CompleteTopicView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)
        progress = complete_topic(request.user, topic)
        return Response({
            'topic_id': topic.id,
            'status': progress.status,
            'completion': progress.completion_pct,
            'profile_xp': request.user.profile.xp,
            'profile_level': request.user.profile.level,
        })

class ResourceListView(generics.ListAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return Resource.objects.filter(topic_id=topic_id)

    def get_serializer_context(self):
        return {'request': self.request}


class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        resource_id = self.request.data.get('resource')
        if Bookmark.objects.filter(user=self.request.user, resource_id=resource_id).exists():
            raise ValidationError('Already bookmarked.')
        serializer.save(user=self.request.user)


class BookmarkDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

class StudySessionCreateView(generics.CreateAPIView):
    serializer_class = StudySessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())  # Monday of this week

        mission_progress = (
            UserTopicProgress.objects.filter(user=user, status='current').first()
            or UserTopicProgress.objects.filter(user=user, status='unlocked').first()
        )
        todays_mission = None
        if mission_progress:
            todays_mission = {
                'topic_id': mission_progress.topic.id,
                'topic_name': mission_progress.topic.name,
                'subject_name': mission_progress.topic.subject.name,
                'xp_reward': mission_progress.topic.xp,
            }

        weekly_minutes = StudySession.objects.filter(
            user=user, date__gte=week_start, date__lte=today
        ).aggregate(total=Sum('minutes'))['total'] or 0

        total_topics = UserTopicProgress.objects.filter(user=user).count()
        completed_topics = UserTopicProgress.objects.filter(user=user, status='completed').count()
        overall_progress = round((completed_topics / total_topics) * 100) if total_topics > 0 else 0

        recent = UserTopicProgress.objects.filter(
            user=user, status='completed'
        ).order_by('-completed_on')[:5]
        recently_completed = [
            {
                'topic_id': r.topic.id,
                'topic_name': r.topic.name,
                'subject_name': r.topic.subject.name,
                'completed_on': r.completed_on,
                'xp': r.topic.xp,
            }
            for r in recent
        ]

        return Response({
            'todays_mission': todays_mission,
            'overall_progress': overall_progress,
            'daily_goal_minutes': profile.daily_goal_minutes,
            'weekly_goal_minutes': profile.weekly_goal_minutes,
            'weekly_progress_minutes': weekly_minutes,
            'recently_completed': recently_completed,
            'profile': {
                'level': profile.level,
                'xp': profile.xp,
                'xp_to_next_level': profile.level * 1000 - profile.xp,
                'streak_days': profile.streak_days,
            },
        })

class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profiles = Profile.objects.select_related('user').order_by('-total_xp')[:50]
        data = [
            {
                'username': p.user.username,
                'level': p.level,
                'total_xp': p.total_xp,
                'rank': i + 1,
            }
            for i, p in enumerate(profiles)
        ]
        serializer = LeaderboardEntrySerializer(data, many=True)
        return Response(serializer.data)

class SyllabusExtractView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded.'}, status=400)

        try:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            return Response({'error': f'Failed to read PDF: {str(e)}'}, status=400)

        return Response({
            'filename': file.name,
            'page_count': len(reader.pages),
            'char_count': len(text),
            'preview': text[:500],
        })

class SyllabusGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded.'}, status=400)

        # 1. Extract text
        try:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            return Response({'error': f'Failed to read PDF: {str(e)}'}, status=400)

        if len(text.strip()) < 50:
            return Response({'error': 'Extracted text too short — is this a scanned/image PDF?'}, status=400)

        # 2. Generate structured tree
        try:
            tree = generate_syllabus_tree(text)
        except Exception as e:
            return Response({'error': f'AI generation failed: {str(e)}'}, status=502)

        # 3. Validate
        is_valid, error = validate_topic_tree(tree)
        if not is_valid:
            return Response({'error': f'Generated tree failed validation: {error}'}, status=502)

        # 4. Save
        profile = request.user.profile
        subject = save_generated_tree(
            tree,
            university=profile.university,
            branch=profile.branch,
            semester=profile.semester,
        )

        # 5. Auto-enroll the requesting user
        # Auto-enroll the requesting user
        enroll_user_in_subject(request.user, subject)
        unlock_achievement(request.user, 'Syllabus Creator')

        return Response({
            'subject_id': subject.id,
            'subject_name': subject.name,
            'topic_count': subject.topics.count(),
        }, status=201)

class TopicChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, topic_id):
        """Fetch conversation history for this user + topic."""
        topic = get_object_or_404(Topic, id=topic_id)
        messages = ChatMessage.objects.filter(user=request.user, topic=topic)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, topic_id):
        """Send a message, get the tutor's reply."""
        topic = get_object_or_404(Topic, id=topic_id)
        user_message = request.data.get('message')
        if not user_message:
            return Response({'error': 'message field is required.'}, status=400)

        progress = UserTopicProgress.objects.filter(user=request.user, topic=topic).first()

        try:
            reply = get_tutor_response(request.user, topic, progress, user_message)
        except Exception as e:
            return Response({'error': f'Tutor failed to respond: {str(e)}'}, status=502)

        return Response({'reply': reply})

class AllResourcesListView(generics.ListAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        enrolled_subject_ids = UserTopicProgress.objects.filter(
            user=user
        ).values_list('topic__subject_id', flat=True).distinct()
        return Resource.objects.filter(topic__subject_id__in=enrolled_subject_ids)

    def get_serializer_context(self):
        return {'request': self.request}

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        # Weekly Study Time (last 7 days)
        week_start = today - timedelta(days=6)
        sessions = StudySession.objects.filter(user=user, date__gte=week_start, date__lte=today)
        minutes_by_day = defaultdict(int)
        for s in sessions:
            minutes_by_day[s.date] += s.minutes

        day_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        weekly_study_time = []
        for i in range(7):
            d = week_start + timedelta(days=i)
            weekly_study_time.append({
                'day': day_labels[d.weekday()],
                'hours': round(minutes_by_day.get(d, 0) / 60, 1),
            })

        # Completion rate
        all_progress = UserTopicProgress.objects.filter(user=user)
        total = all_progress.count()
        completed = all_progress.filter(status='completed').count()
        completion_rate = round((completed / total) * 100) if total > 0 else 0

        # XP timeline (last 9 weeks, cumulative, ending with the current week)
        current_week_start = today - timedelta(days=today.weekday())
        week_starts = [current_week_start - timedelta(weeks=(8 - i)) for i in range(9)]

        completed_progress = UserTopicProgress.objects.filter(
            user=user, status='completed', completed_on__gte=week_starts[0]
        ).select_related('topic')

        xp_by_week = defaultdict(int)
        for p in completed_progress:
            if p.completed_on:
                week_key = p.completed_on - timedelta(days=p.completed_on.weekday())
                xp_by_week[week_key] += p.topic.xp

        xp_timeline = []
        cumulative = 0
        for week_start in week_starts:
            cumulative += xp_by_week.get(week_start, 0)
            xp_timeline.append({'date': week_start.strftime('%b %d'), 'xp': cumulative})

        # Subject mastery radar + hours by subject
        subjects = Subject.objects.filter(topics__user_progress__user=user).distinct()
        completion_radar = []
        subject_comparison = []
        for subj in subjects:
            subj_progress = UserTopicProgress.objects.filter(user=user, topic__subject=subj)
            subj_total = subj_progress.count()
            subj_completed = subj_progress.filter(status='completed').count()
            pct = round((subj_completed / subj_total) * 100) if subj_total > 0 else 0
            completion_radar.append({'subject': subj.name[:12], 'value': pct})

            subj_minutes = StudySession.objects.filter(
                user=user, topic__subject=subj
            ).aggregate(total=Sum('minutes'))['total'] or 0
            subject_comparison.append({'subject': subj.name[:12], 'hours': round(subj_minutes / 60, 1)})

        # Daily activity heatmap (last 70 days, bucketed 0-4)
        seventy_days_ago = today - timedelta(days=69)
        recent_sessions = StudySession.objects.filter(user=user, date__gte=seventy_days_ago, date__lte=today)
        activity_by_day = defaultdict(int)
        for s in recent_sessions:
            activity_by_day[s.date] += 1

        heatmap = []
        for i in range(70):
            d = seventy_days_ago + timedelta(days=i)
            count = activity_by_day.get(d, 0)
            level = 0 if count == 0 else 1 if count == 1 else 2 if count == 2 else 3 if count <= 4 else 4
            heatmap.append(level)

        quiz_attempts = QuizAttempt.objects.filter(user=user).order_by('-taken_at')[:10]
        quiz_history = [
            {
                'topic_name': qa.topic.name,
                'score': qa.score,
                'total': qa.total_questions,
                'percentage': round((qa.score / qa.total_questions) * 100) if qa.total_questions else 0,
                'taken_at': qa.taken_at.strftime('%b %d'),
            }
            for qa in quiz_attempts
        ]
        avg_quiz_score = round(sum(q['percentage'] for q in quiz_history) / len(quiz_history)) if quiz_history else None

        return Response({
            'weeklyStudyTime': weekly_study_time,
            'completionRate': completion_rate,
            'xpTimeline': xp_timeline,
            'completionRadar': completion_radar,
            'subjectComparison': subject_comparison,
            'dailyActivityHeatmap': heatmap,
            'quizHistory': quiz_history,
            'avgQuizScore': avg_quiz_score,
        })

class FetchTopicResourcesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)
        query = f"{topic.name} {topic.subject.name} tutorial"

        existing_urls = set(Resource.objects.filter(topic=topic).values_list('url', flat=True))

        try:
            videos = search_youtube_videos(query, max_results=6)
        except Exception as e:
            return Response({'error': f'YouTube search failed: {str(e)}'}, status=502)

        created = []
        for v in videos:
            if v['url'] in existing_urls:
                continue
            resource = Resource.objects.create(
                topic=topic,
                title=v['title'],
                type='youtube',
                platform='YouTube',
                creator=v['channel'],
                url=v['url'],
                duration='',
                views='',
                rating=0,
                difficulty=topic.difficulty,
                thumbnail_color='emerald',
            )
            created.append(resource.id)
            existing_urls.add(v['url'])
            if len(created) >= 3:
                break

        if not created:
            return Response({'topic_id': topic.id, 'resources_created': [], 'message': 'No new videos found — try again later.'})

        return Response({'topic_id': topic.id, 'resources_created': created})

class GenerateQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)
        profile = request.user.profile

        num_questions = request.data.get('num_questions', 5)
        try:
            num_questions = int(num_questions)
        except (TypeError, ValueError):
            num_questions = 5
        num_questions = max(3, min(num_questions, 20))

        try:
            quiz = generate_quiz(topic.name, topic.description, topic.difficulty, profile.goal_mode, num_questions)
        except Exception as e:
            return Response({'error': f'Quiz generation failed: {str(e)}'}, status=502)

        return Response({
            'topic_id': topic.id,
            'questions': [q.model_dump() for q in quiz.questions],
        })

class QuizAttemptCreateView(generics.CreateAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class QuizAttemptListView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-taken_at')

class ClearTopicChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)
        ChatMessage.objects.filter(user=request.user, topic=topic).delete()
        return Response(status=204)

class TopicSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)

        if topic.summary:
            import json
            return Response(json.loads(topic.summary))

        try:
            result = generate_topic_tutorial(topic.name, topic.description, topic.difficulty, topic.subject.name)
        except Exception as e:
            return Response({'error': f'Tutorial generation failed: {str(e)}'}, status=502)

        data = result.model_dump()
        import json
        topic.summary = json.dumps(data)
        topic.save()

        return Response(data)

class QuizAttemptCreateView(generics.CreateAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        attempt = serializer.save(user=self.request.user)

        if attempt.score == attempt.total_questions:
            unlock_achievement(self.request.user, 'Quiz Ace')

        total_attempts = QuizAttempt.objects.filter(user=self.request.user).count()
        if total_attempts >= 5:
            unlock_achievement(self.request.user, 'Quiz Master')

class MyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = MyProfileSerializer(request.user.profile)
        return Response(serializer.data)