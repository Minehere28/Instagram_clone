from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PostViewSet

router = DefaultRouter(trailing_slash=False)
router.register("", PostViewSet, basename="posts")

urlpatterns = [
    path("posts/", include(router.urls)),
]
