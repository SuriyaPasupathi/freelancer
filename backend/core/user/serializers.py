from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile

User = get_user_model()

# ----------------------
# ✅ UserProfile Serializer (for profile model)
# ----------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


# ----------------------
# ✅ Register Serializer (to create user)
# ----------------------
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# ----------------------
# ✅ Forgot Password
# ----------------------
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


# ----------------------
# ✅ Reset Password
# ----------------------
class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])


# ----------------------
# ✅ Subscription Level Update
# ----------------------
class SubscriptionUpdateSerializer(serializers.Serializer):
    subscription_level = serializers.ChoiceField(choices=['free', 'basic', 'premium'])


# ----------------------
# ✅ Basic User Info Serializer (e.g., for /me endpoint)
# ----------------------
class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
