from django.urls import path

from .views import CommentAPIView, CommentListAPIView, LikeAPIView

urlpatterns = [
    path("likes/", LikeAPIView.as_view(), name="like-unlike"),
    path("comments/", CommentAPIView.as_view(), name="comment-create"),
    path("comments/<int:post_id>", CommentListAPIView.as_view(), name="comment-list"),
]
