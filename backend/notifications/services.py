from notifications.models import Notification


def create_notification(*, receiver, sender, notification_type, post=None):
    if receiver.id == sender.id:
        return None

    return Notification.objects.create(
        user=receiver,
        sender=sender,
        post=post,
        type=notification_type,
    )
