from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FeedAPIView, PostViewSet

router = DefaultRouter(trailing_slash=False)
router.register("", PostViewSet, basename="posts")

urlpatterns = [
    path("feed/", FeedAPIView.as_view(), name="feed"),
    path("posts/", include(router.urls)),
]
