from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.responses import api_error, api_success
from common.schema import OpenApiResponse, OpenApiTypes, extend_schema
from posts.models import Post

from .models import Comment, Like
from .serializers import CommentSerializer, LikeSerializer

from notifications.models import Notification


class CommentPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class LikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=LikeSerializer,
        responses={201: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Like toggled")},
        tags=["Interactions"],
    )
    def post(self, request):
        post_id = request.data.get("post_id")
        if not post_id:
            return api_error("post_id is required.", status_code=status.HTTP_400_BAD_REQUEST)

        post = get_object_or_404(Post, id=post_id)

        like = Like.objects.filter(user=request.user, post=post).first()

        # Nếu đã like → unlike
        if like:
            like.delete()
            return api_success(
                message="Post unliked",
                status_code=status.HTTP_200_OK
            )

        # Nếu chưa like → tạo like
        like = Like.objects.create(user=request.user, post=post)

        # Tạo notification nếu người like không phải chủ bài viết
        if post.user != request.user:
            Notification.objects.create(
                user=post.user,
                sender=request.user,
                post=post,
                type=Notification.NotificationType.LIKE,
            )


        serializer = LikeSerializer(like)

        return api_success(
            serializer.data,
            message="Post liked",
            status_code=status.HTTP_201_CREATED,
        )


class CommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Comments list")},
        tags=["Interactions"],
    )
    def get(self, request):
        post_id = request.query_params.get("post")
        if not post_id:
            return api_error("post query parameter is required.", status_code=status.HTTP_400_BAD_REQUEST)

        post = get_object_or_404(Post, id=post_id)
        queryset = (
            Comment.objects.filter(post=post, parent__isnull=True)
            .select_related("user")
            .prefetch_related("replies__user")
            .order_by("created_at")
        )

        paginator = CommentPagination()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = CommentSerializer(page, many=True, context={"request": request})
        paginated = paginator.get_paginated_response(serializer.data)
        return api_success(paginated.data)

    @extend_schema(
        request=CommentSerializer,
        responses={201: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Comment created")},
        tags=["Interactions"],
    )
    def post(self, request):
        serializer = CommentSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()

        return api_success(
            CommentSerializer(comment, context={"request": request}).data,
            message="Comment created",
            status_code=status.HTTP_201_CREATED,
        )


class CommentListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    @extend_schema(
        responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Comments list")},
        tags=["Interactions"],
    )
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_success(response.data)

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
