from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject, Topic, Profile
from .services import enroll_user_in_subject
from django.shortcuts import get_object_or_404
from .serializers import SubjectSerializer, TopicSerializer, RegisterSerializer, OnboardingSerializer


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]


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