from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subject, Topic, UserTopicProgress, Profile, Resource, Bookmark, Achievement, UserAchievement, StudySession, ChatMessage, QuizAttempt
from django.db.models import Sum


class SubjectSerializer(serializers.ModelSerializer):
    completion = serializers.SerializerMethodField()
    topics_completed = serializers.SerializerMethodField()
    topics_total = serializers.SerializerMethodField()
    xp_earned = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'icon', 'accent', 'difficulty',
            'estimated_hours', 'university', 'branch', 'semester',
            'completion', 'topics_completed', 'topics_total', 'xp_earned', 'is_enrolled',
        ]

    def get_user_progress_qs(self, obj):
        user = self.context['request'].user
        return UserTopicProgress.objects.filter(user=user, topic__subject=obj)

    def get_topics_total(self, obj):
        return obj.topics.count()

    def get_topics_completed(self, obj):
        return self.get_user_progress_qs(obj).filter(status='completed').count()

    def get_completion(self, obj):
        total = self.get_topics_total(obj)
        if total == 0:
            return 0
        completed = self.get_topics_completed(obj)
        return round((completed / total) * 100)

    def get_xp_earned(self, obj):
        completed_progress = self.get_user_progress_qs(obj).filter(status='completed')
        return sum(p.topic.xp for p in completed_progress)

    def get_is_enrolled(self, obj):
        return self.get_user_progress_qs(obj).exists()


class TopicSerializer(serializers.ModelSerializer):
    prerequisites = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    completion = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = [
            'id', 'subject', 'name', 'description', 'prerequisites',
            'estimated_hours', 'difficulty', 'xp', 'icon', 'is_boss',
            'position_x', 'position_y', 'status', 'completion',
        ]

    def get_progress(self, obj):
        user = self.context['request'].user
        return UserTopicProgress.objects.filter(user=user, topic=obj).first()

    def get_status(self, obj):
        progress = self.get_progress(obj)
        return progress.status if progress else 'locked'

    def get_completion(self, obj):
        progress = self.get_progress(obj)
        if progress and progress.status == 'completed':
            return 100
        if not obj.estimated_hours:
            return 0
        total_minutes = StudySession.objects.filter(
            user=self.context['request'].user, topic=obj
        ).aggregate(total=Sum('minutes'))['total'] or 0
        estimated_minutes = obj.estimated_hours * 60
        pct = round((total_minutes / estimated_minutes) * 100)
        return min(pct, 99)  # cap below 100 until actually marked complete

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user

class MyProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'username', 'email', 'level', 'xp', 'total_xp', 'streak_days',
            'education_type', 'board', 'medium', 'class_name', 'stream',
            'university', 'branch', 'semester', 'goal_mode',
        ]

class OnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'education_type', 'board', 'medium', 'class_name', 'stream',
            'university', 'branch', 'semester', 'goal_mode', 'onboarding_completed',
            'daily_goal_minutes', 'weekly_goal_minutes',
        ]

class ResourceSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id', 'topic', 'title', 'type', 'platform', 'creator', 'url',
            'duration', 'views', 'rating', 'difficulty', 'thumbnail_color',
            'is_bookmarked',
        ]

    def get_is_bookmarked(self, obj):
        user = self.context['request'].user
        return Bookmark.objects.filter(user=user, resource=obj).exists()


class BookmarkSerializer(serializers.ModelSerializer):
    resource_detail = ResourceSerializer(source='resource', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'resource', 'resource_detail', 'created_at']

class AchievementSerializer(serializers.ModelSerializer):
    unlocked = serializers.SerializerMethodField()
    progress_pct = serializers.SerializerMethodField()
    unlocked_date = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'tier', 'xp_reward',
            'unlocked', 'progress_pct', 'unlocked_date',
        ]

    def get_user_achievement(self, obj):
        user = self.context['request'].user
        return UserAchievement.objects.filter(user=user, achievement=obj).first()

    def get_unlocked(self, obj):
        ua = self.get_user_achievement(obj)
        return ua.unlocked if ua else False

    def get_progress_pct(self, obj):
        ua = self.get_user_achievement(obj)
        return ua.progress_pct if ua else 0

    def get_unlocked_date(self, obj):
        ua = self.get_user_achievement(obj)
        return ua.unlocked_date if ua else None

class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = ['id', 'topic', 'minutes', 'date', 'created_at']
        read_only_fields = ['created_at']

class LeaderboardEntrySerializer(serializers.Serializer):
    username = serializers.CharField()
    level = serializers.IntegerField()
    total_xp = serializers.IntegerField()
    rank = serializers.IntegerField()

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['id', 'topic', 'score', 'total_questions', 'taken_at']