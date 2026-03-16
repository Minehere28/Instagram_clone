from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from notifications.models import Notification

from .models import Follow, Profile
from .serializers import LoginSerializer, ProfileSerializer, RegisterSerializer


def _get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	return {
		"refresh": str(refresh),
		"access": str(refresh.access_token),
	}


class RegisterAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(
			{
				"user": serializer.data,
				"tokens": _get_tokens_for_user(user),
			},
			status=status.HTTP_201_CREATED,
		)


class LoginAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		user = authenticate(
			username=serializer.validated_data["username"],
			password=serializer.validated_data["password"],
		)
		if not user:
			return Response(
				{"detail": "Invalid credentials."},
				status=status.HTTP_401_UNAUTHORIZED,
			)

		return Response(
			{
				"user": {"id": user.id, "username": user.username, "email": user.email},
				"tokens": _get_tokens_for_user(user),
			},
			status=status.HTTP_200_OK,
		)


class UserProfileAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, id):
		target_user = get_object_or_404(User, id=id)
		profile, _ = Profile.objects.get_or_create(user=target_user)
		serializer = ProfileSerializer(profile)
		return Response(serializer.data)


class FollowUserAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, id):
		target_user = get_object_or_404(User, id=id)
		if target_user == request.user:
			return Response(
				{"detail": "You cannot follow yourself."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		_, created = Follow.objects.get_or_create(
			follower=request.user,
			following=target_user,
		)
		if not created:
			return Response(
				{"detail": "Already following this user."},
				status=status.HTTP_200_OK,
			)

		Notification.objects.create(
			user=target_user,
			sender=request.user,
			type=Notification.NotificationType.FOLLOW,
		)
		return Response({"detail": "Followed successfully."}, status=status.HTTP_201_CREATED)


class UnfollowUserAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, id):
		target_user = get_object_or_404(User, id=id)
		deleted_count, _ = Follow.objects.filter(
			follower=request.user,
			following=target_user,
		).delete()

		if deleted_count == 0:
			return Response(
				{"detail": "You are not following this user."},
				status=status.HTTP_404_NOT_FOUND,
			)

		return Response({"detail": "Unfollowed successfully."}, status=status.HTTP_200_OK)
