from django.urls import path

from .views import (
    ChangeAvatarAPIView,
    FollowUserAPIView,
    LoginAPIView,
    LogoutAPIView,
    RefreshTokenAPIView,
    RegisterAPIView,
    UpdateBioAPIView,
    UserProfileByUsernameAPIView,
    UserSearchAPIView,
    UnfollowUserAPIView,
    UserProfileAPIView,
)

urlpatterns = [
    path("auth/register", RegisterAPIView.as_view(), name="register"),
    path("auth/login", LoginAPIView.as_view(), name="login"),
    path("auth/refresh", RefreshTokenAPIView.as_view(), name="refresh"),
    path("auth/logout", LogoutAPIView.as_view(), name="logout"),
    path("users/profile/<int:id>", UserProfileAPIView.as_view(), name="user-profile"),
    path(
        "users/profile/username/<str:username>",
        UserProfileByUsernameAPIView.as_view(),
        name="user-profile-by-username",
    ),
    path("users/search/", UserSearchAPIView.as_view(), name="user-search"),
    path("users/profile/avatar", ChangeAvatarAPIView.as_view(), name="change-avatar"),
    path("users/profile/bio", UpdateBioAPIView.as_view(), name="update-bio"),
    path("users/follow/<int:id>", FollowUserAPIView.as_view(), name="follow-user"),
    path("users/unfollow/<int:id>", UnfollowUserAPIView.as_view(), name="unfollow-user"),
]
