from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    SubjectListView, TopicListView, RegisterView, OnboardingView, EnrollView, CompleteTopicView, ResourceListView,
    BookmarkListCreateView, BookmarkDeleteView, AchievementListView, StudySessionCreateView, DashboardView, LeaderboardView,
    SyllabusExtractView, SyllabusGenerateView, TopicChatView, AllResourcesListView, AnalyticsView, FetchTopicResourcesView,
    GenerateQuizView, QuizAttemptCreateView, QuizAttemptListView, ClearTopicChatView, TopicSummaryView
)

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('subjects/<int:subject_id>/topics/', TopicListView.as_view(), name='topic-list'),
    path('subjects/<int:subject_id>/enroll/', EnrollView.as_view(), name='subject-enroll'),
    path('topics/<int:topic_id>/complete/', CompleteTopicView.as_view(), name='topic-complete'),
    path('topics/<int:topic_id>/resources/', ResourceListView.as_view(), name='topic-resources'),
    path('bookmarks/', BookmarkListCreateView.as_view(), name='bookmark-list-create'),
    path('bookmarks/<int:pk>/', BookmarkDeleteView.as_view(), name='bookmark-delete'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('onboarding/', OnboardingView.as_view(), name='onboarding'),
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
    path('study-sessions/', StudySessionCreateView.as_view(), name='study-session-create'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('syllabus/extract-test/', SyllabusExtractView.as_view(), name='syllabus-extract-test'),
    path('syllabus/generate/', SyllabusGenerateView.as_view(), name='syllabus-generate'),
    path('topics/<int:topic_id>/chat/', TopicChatView.as_view(), name='topic-chat'),
    path('resources/', AllResourcesListView.as_view(), name='all-resources'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('topics/<int:topic_id>/fetch-resources/', FetchTopicResourcesView.as_view(), name='topic-fetch-resources'),
    path('topics/<int:topic_id>/generate-quiz/', GenerateQuizView.as_view(), name='generate-quiz'),
    path('quiz-attempts/', QuizAttemptCreateView.as_view(), name='quiz-attempt-create'),
    path('quiz-attempts/history/', QuizAttemptListView.as_view(), name='quiz-attempt-history'),
    path('topics/<int:topic_id>/chat/clear/', ClearTopicChatView.as_view(), name='topic-chat-clear'),
    path('topics/<int:topic_id>/generate-summary/', TopicSummaryView.as_view(), name='topic-summary'),
]