from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject, Topic, Profile, Resource, Bookmark, Achievement, UserAchievement, StudySession, UserTopicProgress, ChatMessage
from .services import enroll_user_in_subject, complete_topic
from django.shortcuts import get_object_or_404
from .serializers import SubjectSerializer, TopicSerializer, RegisterSerializer, OnboardingSerializer, ResourceSerializer, BookmarkSerializer, AchievementSerializer, StudySessionSerializer, LeaderboardEntrySerializer, ChatMessageSerializer
from rest_framework.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from pypdf import PdfReader
from rest_framework.parsers import MultiPartParser
from .ai_services import generate_syllabus_tree, validate_topic_tree, save_generated_tree
from .tutor_service import get_tutor_response

class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

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
        enroll_user_in_subject(request.user, subject)

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