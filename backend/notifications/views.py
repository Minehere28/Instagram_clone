from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.responses import api_success
from common.schema import OpenApiResponse, OpenApiTypes, extend_schema

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Notifications")},
        tags=["Notifications"],
    )
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).select_related(
            "sender", "user", "post"
        ).order_by("-created_at")
        serializer = NotificationSerializer(notifications, many=True)
        return api_success(serializer.data)


class MarkNotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Notification marked read")},
        tags=["Notifications"],
    )
    def post(self, request, id):
        notification = get_object_or_404(Notification, id=id, user=request.user)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return api_success(NotificationSerializer(notification).data, status_code=status.HTTP_200_OK)
