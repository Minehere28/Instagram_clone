from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    bio = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username


class Follow(models.Model):

    follower = models.ForeignKey(
        User,
        related_name='following',
        on_delete=models.CASCADE
    )

    following = models.ForeignKey(
        User,
        related_name='followers',
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} -> {self.following}"


class Post(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    caption = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post {self.id} by {self.user}"


class PostImage(models.Model):

    post = models.ForeignKey(
        Post,
        related_name='images',
        on_delete=models.CASCADE
    )

    image = models.ImageField(upload_to='posts/')

    display_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for Post {self.post.id}"


class Like(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user} likes Post {self.post.id}"


class Comment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='replies',
        on_delete=models.CASCADE
    )

    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user}"


class Hashtag(models.Model):

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"#{self.name}"


class PostHashtag(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    hashtag = models.ForeignKey(
        Hashtag,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('post', 'hashtag')

    def __str__(self):
        return f"{self.post} -> #{self.hashtag.name}"


class Notification(models.Model):

    NOTIFICATION_TYPES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow'),
    )

    user = models.ForeignKey(
        User,
        related_name='notifications',
        on_delete=models.CASCADE
    )

    sender = models.ForeignKey(
        User,
        related_name='sent_notifications',
        on_delete=models.CASCADE
    )

    post = models.ForeignKey(
        Post,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user}"