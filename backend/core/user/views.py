from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, status
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserProfileSerializer, RequestPasswordResetSerializer, PasswordResetConfirmSerializer,ReviewSerializer
from .models import UserProfile,Review  # Assuming CustomUser is the model for your custom user
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str

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
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createaccount(request):
    user = request.user
    data = request.data

    profile, created = UserProfile.objects.get_or_create(user=user)
    subscription_type = data.get('subscription_type', 'free')

    profile.subscription_type = subscription_type
    profile.name = data.get('name', '')
    profile.job_title = data.get('job_title', '')
    profile.job_specialization = data.get('job_specialization', '')

    if request.FILES.get('profile_pic'):
        profile.profile_pic = request.FILES['profile_pic']

    if subscription_type == 'standard' or subscription_type == 'premium':
        profile.email = data.get('email', '')
        profile.mobile = data.get('mobile', '')
        profile.services = data.get('services', '')
        profile.experiences = data.get('experiences', '')
        profile.skills = data.get('skills', '')
        profile.tools = data.get('tools', '')

    if subscription_type == 'premium':
        profile.education = data.get('education', '')
        profile.certifications = data.get('certifications', '')
        profile.portfolio = data.get('portfolio', '')
        if request.FILES.get('video_intro'):
            profile.video_intro = request.FILES['video_intro']

    profile.save()
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()

        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        subscription = self.request.query_params.get('subscription')
        if subscription:
            queryset = queryset.filter(subscription_type=subscription)

        return queryset

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def upgrade_subscription(self, request, pk=None):
        profile = self.get_object()
        subscription_type = request.data.get('subscription_type')
        
        if subscription_type not in [choice[0] for choice in UserProfile.SUBSCRIPTION_CHOICES]:
            return Response(
                {'error': 'Invalid subscription type'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile.subscription_type = subscription_type
        profile.save()
        return Response({'status': 'subscription updated'})


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        profile_id = self.request.data.get('profile_id')
        try:
            profile = UserProfile.objects.get(id=profile_id)
            serializer.save(profile=profile)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
class CheckProfileStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile, context={"request": request})
            return Response({
                "has_profile": True,
                # "profile": serializer.data
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"has_profile": False}, status=status.HTTP_200_OK)  



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        print(f"Request User: {request.user}")  # Debug print to see if user is authenticated
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'Profile does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    serializer = UserProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)


class RequestResetPasswordView(APIView):
    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"http://localhost:5173/ResetPassword?uid={uid}&token={token}"

            send_mail(
                "Reset Your Password",
                f"Click the link to reset your password: {reset_link}",
                "no-reply@yourapp.com",
                [email],
            )

            return Response({"message": "Password reset link sent to your email."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful."})
            else:
                return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)