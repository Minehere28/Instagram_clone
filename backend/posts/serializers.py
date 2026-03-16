from django.db import transaction
from rest_framework import serializers

from users.serializers import UserSerializer

from .models import Hashtag, Post, PostHashtag, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "image_url", "display_order", "created_at"]


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ["id", "name"]


class PostHashtagSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(read_only=True)

    class Meta:
        model = PostHashtag
        fields = ["id", "hashtag"]


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    hashtags = serializers.SerializerMethodField()
    hashtag_names = serializers.ListField(
        child=serializers.CharField(max_length=100),
        write_only=True,
        required=False,
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "caption",
            "images",
            "hashtags",
            "hashtag_names",
            "uploaded_images",
            "created_at",
            "updated_at",
        ]

    def get_hashtags(self, obj):
        return [item.hashtag.name for item in obj.post_hashtags.select_related("hashtag")]

    def create(self, validated_data):
        hashtags = validated_data.pop("hashtag_names", [])
        uploaded_images = validated_data.pop("uploaded_images", [])
        user = self.context["request"].user

        with transaction.atomic():
            post = Post.objects.create(user=user, **validated_data)

            for index, image in enumerate(uploaded_images):
                PostImage.objects.create(
                    post=post,
                    image_url=image,
                    display_order=index,
                )

            for tag_name in hashtags:
                cleaned_name = tag_name.strip().lstrip("#").lower()
                if not cleaned_name:
                    continue
                hashtag, _ = Hashtag.objects.get_or_create(name=cleaned_name)
                PostHashtag.objects.get_or_create(post=post, hashtag=hashtag)

        return post
