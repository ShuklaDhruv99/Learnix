from .models import Topic, UserTopicProgress, Profile, Achievement, UserAchievement


def xp_required_for_level(level):
    return level * 1000


def award_xp(profile, amount):
    profile.xp += amount
    while profile.xp >= xp_required_for_level(profile.level):
        profile.xp -= xp_required_for_level(profile.level)
        profile.level += 1
    profile.save()


def enroll_user_in_subject(user, subject):
    topics = Topic.objects.filter(subject=subject).prefetch_related('prerequisites')
    created = []
    for topic in topics:
        _, was_created = UserTopicProgress.objects.get_or_create(
            user=user,
            topic=topic,
            defaults={
                'status': 'unlocked' if topic.prerequisites.count() == 0 else 'locked',
                'completion_pct': 0,
            },
        )
        if was_created:
            created.append(topic.id)
    return created


def complete_topic(user, topic):
    progress, _ = UserTopicProgress.objects.get_or_create(user=user, topic=topic)

    if progress.status == 'completed':
        return progress

    from django.utils import timezone
    progress.status = 'completed'
    progress.completion_pct = 100
    progress.completed_on = timezone.now().date()
    progress.save()

    profile = user.profile
    award_xp(profile, topic.xp)

    check_achievements_on_topic_complete(user) 

    for dependent in topic.unlocks.all():
        dep_progress, _ = UserTopicProgress.objects.get_or_create(
            user=user, topic=dependent, defaults={'status': 'locked'}
        )
        if dep_progress.status == 'locked':
            all_prereqs_done = all(
                UserTopicProgress.objects.filter(
                    user=user, topic=prereq, status='completed'
                ).exists()
                for prereq in dependent.prerequisites.all()
            )
            if all_prereqs_done:
                dep_progress.status = 'unlocked'
                dep_progress.save()

    return progress

def unlock_achievement(user, achievement_name):
    """Unlock a named achievement for a user, if not already unlocked. Awards its XP once."""
    try:
        achievement = Achievement.objects.get(name=achievement_name)
    except Achievement.DoesNotExist:
        return None

    from django.utils import timezone
    ua, created = UserAchievement.objects.get_or_create(
        user=user, achievement=achievement,
        defaults={'unlocked': False, 'progress_pct': 0},
    )

    if ua.unlocked:
        return ua  # already unlocked, no double-award

    ua.unlocked = True
    ua.progress_pct = 100
    ua.unlocked_date = timezone.now().date()
    ua.save()

    award_xp(user.profile, achievement.xp_reward)
    return ua


def check_achievements_on_topic_complete(user):
    """Run all achievement checks relevant to completing a topic."""
    completed_count = UserTopicProgress.objects.filter(user=user, status='completed').count()

    if completed_count == 1:
        unlock_achievement(user, 'First Topic')

    # Add more rules here as you define more achievements, e.g.:
    # if completed_count == 10:
    #     unlock_achievement(user, 'Ten Topics')