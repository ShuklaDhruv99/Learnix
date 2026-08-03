from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subject, Topic, UserTopicProgress, Profile


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
        ]