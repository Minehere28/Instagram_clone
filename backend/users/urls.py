from django.urls import path

from .views import (
    FollowUserAPIView,
    LoginAPIView,
    RegisterAPIView,
    UnfollowUserAPIView,
    UserProfileAPIView,
)

urlpatterns = [
    path("auth/register", RegisterAPIView.as_view(), name="register"),
    path("auth/login", LoginAPIView.as_view(), name="login"),
    path("users/profile/<int:id>", UserProfileAPIView.as_view(), name="user-profile"),
    path("users/follow/<int:id>", FollowUserAPIView.as_view(), name="follow-user"),
    path("users/unfollow/<int:id>", UnfollowUserAPIView.as_view(), name="unfollow-user"),
]
