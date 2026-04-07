from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from common.responses import api_error, api_success
from common.schema import OpenApiResponse, OpenApiTypes, extend_schema

from .models import Follow, Profile
from .serializers import (
	LoginSerializer,
	LogoutSerializer,
	ProfileSerializer,
	RefreshSerializer,
	RegisterSerializer,
	UserSearchSerializer,
	UserSerializer,
)


def _get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	return {
		"refresh": str(refresh),
		"access": str(refresh.access_token),
	}


class RegisterAPIView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [ScopedRateThrottle]
	throttle_scope = "auth_register"

	@extend_schema(
		request=RegisterSerializer,
		responses={
			201: OpenApiResponse(response=OpenApiTypes.OBJECT, description="User registered"),
		},
		tags=["Auth"],
	)
	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		tokens = _get_tokens_for_user(user)
		return api_success(
			{
				"access": tokens["access"],
				"refresh": tokens["refresh"],
				"user": UserSerializer(user).data,
			},
			message="Registration successful",
			status_code=status.HTTP_201_CREATED,
		)


class LoginAPIView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [ScopedRateThrottle]
	throttle_scope = "auth_login"

	@extend_schema(
		request=LoginSerializer,
		responses={
			200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Authenticated"),
			401: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Invalid credentials"),
		},
		tags=["Auth"],
	)
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		user = authenticate(
			username=serializer.validated_data["username"],
			password=serializer.validated_data["password"],
		)
		if not user:
			return api_error("Invalid credentials.", status_code=status.HTTP_401_UNAUTHORIZED)

		tokens = _get_tokens_for_user(user)
		return api_success(
			{
				"access": tokens["access"],
				"refresh": tokens["refresh"],
				"user": UserSerializer(user).data,
			},
			message="Login successful",
			status_code=status.HTTP_200_OK,
		)


class RefreshTokenAPIView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [ScopedRateThrottle]
	throttle_scope = "auth_login"

	@extend_schema(
		request=RefreshSerializer,
		responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Token refreshed")},
		tags=["Auth"],
	)
	def post(self, request):
		serializer = RefreshSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		return api_success(
			serializer.validated_data,
			message="Token refreshed",
			status_code=status.HTTP_200_OK,
		)


class LogoutAPIView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		request=LogoutSerializer,
		responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Logged out")},
		tags=["Auth"],
	)
	def post(self, request):
		serializer = LogoutSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			token = RefreshToken(serializer.validated_data["refresh"])
			token.blacklist()
		except Exception:
			return api_error("Invalid refresh token.", status_code=status.HTTP_400_BAD_REQUEST)

		return api_success(message="Logout successful", status_code=status.HTTP_200_OK)


class UserProfileAPIView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		responses={200: ProfileSerializer},
		tags=["Users"],
	)
	def get(self, request, id):
		target_user = get_object_or_404(User, id=id)
		profile, _ = Profile.objects.get_or_create(user=target_user)
		serializer = ProfileSerializer(profile, context={"request": request})
		return api_success(serializer.data)


class FollowUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={201: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Followed")},
        tags=["Users"],
    )
    def post(self, request, id):
        target_user = get_object_or_404(User, id=id)
        if target_user == request.user:
            return api_error("You cannot follow yourself.", status_code=status.HTTP_400_BAD_REQUEST)

        _, created = Follow.objects.get_or_create(
            follower=request.user,
            following=target_user,
        )
        if not created:
            return api_success(message="Already following this user.", status_code=status.HTTP_200_OK)

        return api_success(message="Followed successfully.", status_code=status.HTTP_201_CREATED)


class UnfollowUserAPIView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Unfollowed")},
		tags=["Users"],
	)
	def post(self, request, id):
		target_user = get_object_or_404(User, id=id)
		deleted_count, _ = Follow.objects.filter(
			follower=request.user,
			following=target_user,
		).delete()

		if deleted_count == 0:
			return api_error("You are not following this user.", status_code=status.HTTP_404_NOT_FOUND)

		return api_success(message="Unfollowed successfully.", status_code=status.HTTP_200_OK)


class UserSearchAPIView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		responses={200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="User search results")},
		tags=["Users"],
	)
	def get(self, request):
		query = request.query_params.get("q", "").strip()
		if not query:
			return api_success([])

		users = (
			User.objects.select_related("profile")
			.filter(Q(username__icontains=query))
			.order_by("username")[:10]
		)
		serializer = UserSearchSerializer(users, many=True, context={"request": request})
		return api_success(serializer.data)
