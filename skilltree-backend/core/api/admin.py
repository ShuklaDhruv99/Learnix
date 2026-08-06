from django.contrib import admin
from .models import Profile, Subject, Topic, UserTopicProgress, Resource, Bookmark, Achievement, UserAchievement, StudySession, ChatMessage, QuizAttempt

# Register your models here.
admin.site.register(Profile)
admin.site.register(Subject)

class TopicAdmin(admin.ModelAdmin):
    filter_horizontal = ('prerequisites',)
    list_display = ('name', 'subject', 'difficulty', 'is_boss')
    list_filter = ('subject', 'difficulty')

admin.site.register(Topic, TopicAdmin)

admin.site.register(UserTopicProgress)
admin.site.register(Resource)
admin.site.register(Bookmark)
admin.site.register(Achievement)
admin.site.register(UserAchievement)
admin.site.register(StudySession)
admin.site.register(ChatMessage)
admin.site.register(QuizAttempt)