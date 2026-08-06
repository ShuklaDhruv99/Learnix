from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    EDUCATION_TYPES = [
        ('school','School'),
        ('college','College'),
        ('other','Other')
    ]
    GOAL_MODES = [
        ('pass', 'Pass Mode'),
        ('average', 'Average Mode'),
        ('topper', 'Topper Mode'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Gamification
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)
    total_xp = models.PositiveIntegerField(default=0)
    coins = models.PositiveIntegerField(default=0)
    streak_days = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)

    # Onboarding/academic context
    education_type = models.CharField(max_length=20,choices=EDUCATION_TYPES,null=True,blank=True)
    board = models.CharField(max_length=100,null=True,blank=True)
    medium = models.CharField(max_length=50,null=True,blank=True)
    class_name = models.CharField(max_length=20,null=True,blank=True)
    stream = models.CharField(max_length=50,null=True,blank=True)
    university = models.CharField(max_length=150,null=True,blank=True)
    branch = models.CharField(max_length=100,null=True,blank=True)
    semester = models.PositiveIntegerField(null=True,blank=True)
    goal_mode = models.CharField(max_length=20,choices=GOAL_MODES,null=True,blank=True)
    onboarding_completed = models.BooleanField(default=False)

    # Profile
    bio = models.TextField(blank=True)
    avatar_color = models.CharField(max_length=20,default='emerald')

    created_at = models.DateTimeField(auto_now_add=True)
    daily_goal_minutes = models.PositiveIntegerField(default=60)
    weekly_goal_minutes = models.PositiveIntegerField(default=420)

    def __str__(self):
        return self.user.username

class Subject(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy','Easy'),
        ('Medium','Medium'),
        ('Hard','Hard')
    ]

    name = models.CharField(max_length=150)
    icon = models.CharField(max_length=50,blank=True)
    accent = models.CharField(max_length=20,default='emerald')
    difficulty = models.CharField(max_length=10,choices=DIFFICULTY_CHOICES,default='Medium')
    estimated_hours = models.PositiveIntegerField(default=0)

    # Context this subject belongs to (so AI-generated trees are scoped correctly)
    university = models.CharField(max_length=150,null=True,blank=True)
    branch = models.CharField(max_length=100,null=True,blank=True)
    semester = models.PositiveIntegerField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Topic(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='unlocks')

    estimated_hours = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Medium')
    xp = models.PositiveIntegerField(default=100)
    icon = models.CharField(max_length=50, blank=True)
    is_boss = models.BooleanField(default=False)
    summary = models.TextField(blank=True, null=True)

    # Layout hints for the React Flow visualization
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.subject.name})"

class UserTopicProgress(models.Model):
    STATUS_CHOICES = [
        ('locked', 'Locked'),
        ('unlocked', 'Unlocked'),
        ('current', 'Current'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_progress')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='locked')
    completion_pct = models.PositiveIntegerField(default=0)
    completed_on = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'topic')

    def __str__(self):
        return f"{self.user.username} - {self.topic.name} ({self.status})"

class Resource(models.Model):
    TYPE_CHOICES = [
        ('youtube', 'YouTube'),
        ('pdf', 'PDF'),
        ('article', 'Article'),
        ('mcq', 'MCQ'),
    ]

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=250)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    platform = models.CharField(max_length=100, blank=True)
    creator = models.CharField(max_length=150, blank=True)
    url = models.URLField(blank=True)
    duration = models.CharField(max_length=50, blank=True)  # e.g. "1h 40m", "18 pages", "20 Qs"
    views = models.CharField(max_length=20, blank=True)      # e.g. "2.1M" - kept as string to match display format
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    difficulty = models.CharField(max_length=10, blank=True)
    thumbnail_color = models.CharField(max_length=20, default='emerald')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.username} bookmarked {self.resource.title}"

class Achievement(models.Model):
    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    tier = models.CharField(max_length=10, choices=TIER_CHOICES, default='bronze')
    xp_reward = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='unlocked_by')
    unlocked = models.BooleanField(default=False)
    progress_pct = models.PositiveIntegerField(default=0)
    unlocked_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        status = "unlocked" if self.unlocked else f"{self.progress_pct}%"
        return f"{self.user.username} - {self.achievement.name} ({status})"

class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='study_sessions', null=True, blank=True)
    minutes = models.PositiveIntegerField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.minutes}min on {self.date}"

class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='chat_messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} - {self.topic.name} - {self.role}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='quiz_attempts')
    score = models.PositiveIntegerField()  # number correct
    total_questions = models.PositiveIntegerField()
    taken_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.topic.name} - {self.score}/{self.total_questions}"