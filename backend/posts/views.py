from django.db.models import Q
from rest_framework import permissions, viewsets

from users.models import Follow

from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        queryset = (
            Post.objects.select_related("user")
            .prefetch_related("images", "post_hashtags__hashtag")
            .order_by("-created_at")
        )
        followed_user_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list("following_id", flat=True)
        return queryset.filter(
            Q(user=self.request.user) | Q(user_id__in=followed_user_ids)
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
