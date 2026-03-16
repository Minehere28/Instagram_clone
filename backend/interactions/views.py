from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification
from posts.models import Post

from .models import Comment, Like
from .serializers import CommentSerializer, LikeSerializer


class CommentPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class LikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        post_id = request.data.get("post_id")
        if not post_id:
            return Response(
                {"detail": "post_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if created and post.user_id != request.user.id:
            Notification.objects.create(
                user=post.user,
                sender=request.user,
                post=post,
                type=Notification.NotificationType.LIKE,
            )

        serializer = LikeSerializer(like)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def delete(self, request):
        post_id = request.data.get("post_id")
        if not post_id:
            return Response(
                {"detail": "post_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        post = get_object_or_404(Post, id=post_id)
        deleted_count, _ = Like.objects.filter(user=request.user, post=post).delete()
        if deleted_count == 0:
            return Response(
                {"detail": "Like not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        post_id = request.query_params.get("post")
        if not post_id:
            return Response(
                {"detail": "post query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        post = get_object_or_404(Post, id=post_id)
        queryset = (
            Comment.objects.filter(post=post, parent__isnull=True)
            .select_related("user")
            .prefetch_related("replies__user")
            .order_by("created_at")
        )

        paginator = CommentPagination()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = CommentSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()

        if comment.post.user_id != request.user.id:
            Notification.objects.create(
                user=comment.post.user,
                sender=request.user,
                post=comment.post,
                type=Notification.NotificationType.COMMENT,
            )

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class CommentListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        post_id = self.kwargs.get("post_id") or self.request.query_params.get("post")
        if not post_id:
            return Comment.objects.none()

        post = get_object_or_404(Post, id=post_id)
        return (
            Comment.objects.filter(post=post, parent__isnull=True)
            .select_related("user")
            .prefetch_related("replies__user")
            .order_by("created_at")
        )
