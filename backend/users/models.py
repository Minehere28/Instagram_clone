from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/')
    bio = models.TextField(blank=True)

class Follow(models.Model):

    follower = models.ForeignKey(User,
                                 related_name='following',
                                 on_delete=models.CASCADE)

    following = models.ForeignKey(User,
                                  related_name='followers',
                                  on_delete=models.CASCADE)

from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/')
    caption = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

class Like(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)

class Comment(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE)

    post = models.ForeignKey(Post,on_delete=models.CASCADE)

    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

