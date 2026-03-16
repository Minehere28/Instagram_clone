from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.pagination import PageNumberPagination

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
