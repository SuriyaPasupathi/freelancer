from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserProfileSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .models import CustomUser  # Assuming CustomUser is the model for your custom user
from rest_framework.permissions import IsAuthenticated


User = get_user_model()

# ✅ Register View
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This calls the create method inside the serializer
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Login View (Custom response with tokens)
class CustomLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            })

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# ✅ Get My Account (User Profile)
class MyAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Save based on subscription
        user.role = data.get("role")
        user.profile_pic = request.FILES.get("profilePic")

        if user.subscription_level in ["basic", "premium"]:
            user.about = data.get("about")
            user.contact_info = data.get("contact_info")

        if user.subscription_level == "premium":
            user.education = data.get("education")
            user.experience = data.get("experience")

        user.save()
        return Response({"message": "Account details updated"}, status=200)


# ✅ Forgot Password
class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                token = get_random_string(length=64)
                user.reset_token = token
                user.token_created_at = now()
                user.save()
                send_mail("Reset Password", f"Token: {token}", "noreply@example.com", [user.email])
                return Response({"message": "Reset token sent."})
            except User.DoesNotExist:
                return Response({"error": "Email not registered."}, status=404)
        return Response(serializer.errors, status=400)

# ✅ Reset Password
class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(reset_token=serializer.validated_data['token'])
                user.set_password(serializer.validated_data['password'])
                user.reset_token = None
                user.token_created_at = None
                user.save()
                return Response({"message": "Password reset successful."})
            except User.DoesNotExist:
                return Response({"error": "Invalid token."}, status=400)
        return Response(serializer.errors, status=400)

# ✅ Subscription Payment (Handle Payment and Update Subscription Level)
class UpdateSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subscription_level = request.data.get("subscription_level")
        user = request.user
        
        if subscription_level not in ['free', 'basic', 'premium']:
            return Response({"error": "Invalid subscription level."}, status=400)

        user.subscription_level = subscription_level
        user.save()

        return Response({"message": f"Subscription updated to {subscription_level}."})
