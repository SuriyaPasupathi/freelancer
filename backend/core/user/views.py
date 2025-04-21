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
from .serializers import RegisterSerializer, UserProfileSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,ReviewSerializer
from .models import UserProfile,Review  # Assuming CustomUser is the model for your custom user
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


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
    profile, created = UserProfile.objects.get_or_create(user=user)

    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile saved successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                "profile": serializer.data
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"has_profile": False}, status=status.HTTP_200_OK)  



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'Profile does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

