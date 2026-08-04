from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subject, Topic, UserTopicProgress, Profile, Resource, Bookmark, Achievement, UserAchievement, StudySession, ChatMessage


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'icon', 'accent', 'difficulty',
            'estimated_hours', 'university', 'branch', 'semester',
        ]


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
        return progress.completion_pct if progress else 0

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
        Profile.objects.create(user=user)
        return user


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