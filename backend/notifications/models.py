from django.contrib.auth.models import User
from django.db import models

from posts.models import Post


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        LIKE = "like", "Like"
        COMMENT = "comment", "Comment"
        FOLLOW = "follow", "Follow"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications_received",
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications_sent",
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="notifications",
        blank=True,
        null=True,
    )
    type = models.CharField(max_length=20, choices=NotificationType.choices)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"Notification({self.type}) from {self.sender.username} "
            f"to {self.user.username}"
        )
