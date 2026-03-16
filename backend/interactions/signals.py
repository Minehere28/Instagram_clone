from django.db.models.signals import post_save
from django.dispatch import receiver

from interactions.models import Comment, Like
from notifications.models import Notification
from notifications.services import create_notification


@receiver(post_save, sender=Like)
def notify_on_like(sender, instance, created, **kwargs):
    if not created:
        return

    create_notification(
        receiver=instance.post.user,
        sender=instance.user,
        post=instance.post,
        notification_type=Notification.NotificationType.LIKE,
    )


@receiver(post_save, sender=Comment)
def notify_on_comment(sender, instance, created, **kwargs):
    if not created:
        return

    create_notification(
        receiver=instance.post.user,
        sender=instance.user,
        post=instance.post,
        notification_type=Notification.NotificationType.COMMENT,
    )
