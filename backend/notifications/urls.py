from django.urls import path

from .views import MarkNotificationReadAPIView, NotificationListAPIView

urlpatterns = [
    path("", NotificationListAPIView.as_view(), name="notification-list"),
    path("read/<int:id>", MarkNotificationReadAPIView.as_view(), name="notification-read"),
]
