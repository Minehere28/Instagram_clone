from django.db import transaction
from rest_framework import serializers

from interactions.models import Like
from users.serializers import UserSerializer

from .models import Hashtag, Post, PostHashtag, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ["id", "image_url", "image", "display_order", "created_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        url = None
        if obj.image_url:
            url = (
                request.build_absolute_uri(obj.image_url.url)
                if request
                else obj.image_url.url
            )
        return {
            "url": url,
            "name": obj.image_url.name.split("/")[-1] if obj.image_url else None,
            "size": obj.image_url.size if obj.image_url else None,
        }


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
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
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
            "likes_count",
            "comments_count",
            "is_liked",
            "hashtag_names",
            "uploaded_images",
            "created_at",
            "updated_at",
        ]

    def get_hashtags(self, obj):
        return [item.hashtag.name for item in obj.post_hashtags.select_related("hashtag")]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        return Like.objects.filter(user=request.user, post=obj).exists()

    def get_comments_count(self, obj):
        # count only top-level comments (exclude replies)
        return obj.comments.filter(parent__isnull=True).count()

    def create(self, validated_data):
        hashtags = validated_data.pop("hashtag_names", [])
        uploaded_images = validated_data.pop("uploaded_images", [])

        # normalize hashtag input
        normalized_hashtags = []

        for tag in hashtags:
            if isinstance(tag, str) and "," in tag:
                normalized_hashtags.extend(
                    [t.strip() for t in tag.split(",") if t.strip()]
                )
            else:
                normalized_hashtags.append(tag.strip())

        hashtags = normalized_hashtags
        with transaction.atomic():
            post = Post.objects.create(**validated_data)

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

                PostHashtag.objects.get_or_create(
                    post=post,
                    hashtag=hashtag
                )

        return post
