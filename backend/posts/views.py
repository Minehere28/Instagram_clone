from django.db.models import Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.pagination import PageNumberPagination

from common.responses import api_success
from common.schema import OpenApiResponse, OpenApiTypes, extend_schema

from users.models import Follow

from .models import Post
from .serializers import PostSerializer


class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]
    pagination_class = PostPagination

    @extend_schema(tags=["Posts"])
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_success(response.data, status_code=response.status_code)

    @extend_schema(tags=["Posts"])
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return api_success(response.data, status_code=response.status_code)

    @extend_schema(
        request=PostSerializer,
        responses={201: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Post created")},
        tags=["Posts"],
    )
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return api_success(response.data, message="Post created", status_code=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = (
            Post.objects.select_related("user")
            .prefetch_related("images", "post_hashtags__hashtag")
            .order_by("-created_at")
        )
        followed_user_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list("following_id", flat=True)

        filtered_queryset = queryset.filter(
            Q(user=self.request.user) | Q(user_id__in=followed_user_ids)
        )

        user_id = self.request.query_params.get("user")
        hashtag = self.request.query_params.get("hashtag")

        if user_id:
            filtered_queryset = filtered_queryset.filter(user_id=user_id)

        if hashtag:
            normalized_hashtag = hashtag.strip().lstrip("#").lower()
            if normalized_hashtag:
                filtered_queryset = filtered_queryset.filter(
                    post_hashtags__hashtag__name=normalized_hashtag
                )

        return filtered_queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination

    @extend_schema(
        responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Feed posts")},
        tags=["Feed"],
    )
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        return api_success(response.data)

    def get_queryset(self):
        followed_user_ids = Follow.objects.filter(follower=self.request.user).values_list(
            "following_id", flat=True
        )
        return (
            Post.objects.select_related("user")
            .prefetch_related("images", "post_hashtags__hashtag")
            .filter(Q(user=self.request.user) | Q(user_id__in=followed_user_ids))
            .order_by("-created_at")
            .distinct()
        )
