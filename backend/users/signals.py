from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.models import Notification
from notifications.services import create_notification
from users.models import Follow


@receiver(post_save, sender=Follow)
def notify_on_follow(sender, instance, created, **kwargs):
    if not created:
        return

    create_notification(
        receiver=instance.following,
        sender=instance.follower,
        notification_type=Notification.NotificationType.FOLLOW,
    )
