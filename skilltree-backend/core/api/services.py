from .models import Topic, UserTopicProgress


def enroll_user_in_subject(user, subject):
    """
    Create a UserTopicProgress row for every topic in `subject` that the
    user doesn't already have progress for. Topics with no prerequisites
    start 'unlocked'; everything else starts 'locked'.
    """
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