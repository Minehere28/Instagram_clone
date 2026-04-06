from rest_framework import serializers

from users.serializers import UserSerializer

from .models import Comment, Like


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "post", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "post",
            "parent",
            "content",
            "replies",
            "created_at",
            "updated_at",
        ]

    def get_replies(self, obj):
        replies = obj.replies.select_related("user").all().order_by("created_at")
        return [
            {
                "id": reply.id,
                "user": {
                    "id": reply.user.id,
                    "username": reply.user.username,
                    "email": reply.user.email,
                    "first_name": reply.user.first_name,
                    "last_name": reply.user.last_name,
                },
                "content": reply.content,
                "created_at": reply.created_at,
                "updated_at": reply.updated_at,
            }
            for reply in replies
        ]

    def validate(self, attrs):
        parent = attrs.get("parent")
        post = attrs.get("post")
        if parent and parent.post_id != post.id:
            raise serializers.ValidationError("Reply parent must belong to the same post.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
