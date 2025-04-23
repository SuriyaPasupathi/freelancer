from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, SocialLink, Review, ProfileShare


User = get_user_model()

# ----------------------
# ✅ UserProfile Serializer (for profile model)
# ----------------------
# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = '__all__'


# ----------------------
# ✅ Register Serializer (to create user)
# ----------------------
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

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



# ----------------------
# ✅ Basic User Info Serializer (e.g., for /me endpoint)
# ----------------------
class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')



User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ('id', 'platform', 'url')


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'profile', 'reviewer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate(self, data):
        if not data.get('reviewer_name'):
            raise serializers.ValidationError({"reviewer_name": "Reviewer name is required"})
        if not data.get('comment'):
            raise serializers.ValidationError({"comment": "Comment is required"})
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    social_links = SocialLinkSerializer(many=True, read_only=True)
    client_reviews = ReviewSerializer(many=True, read_only=True)
    
    # Fields for nested creation
    linkedin = serializers.URLField(write_only=True, required=False, allow_blank=True)
    facebook = serializers.URLField(write_only=True, required=False, allow_blank=True)
    twitter = serializers.URLField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = UserProfile
        fields = (
            'id', 'user', 'subscription_type', 'name', 'profile_pic', 'job_title', 
            'job_specialization', 'rating', 'profile_url', 'email', 'mobile',
            'services', 'experiences', 'skills', 'tools', 'education', 'certifications',
            'video_intro', 'portfolio', 'social_links', 'client_reviews',
            # Write-only fields for social links
            'linkedin', 'facebook', 'twitter'
        )
    
    def create(self, validated_data):
        # Extract social links data
        linkedin = validated_data.pop('linkedin', None)
        facebook = validated_data.pop('facebook', None)
        twitter = validated_data.pop('twitter', None)
        
        # Create profile
        profile = UserProfile.objects.create(**validated_data)
        
        # Create social links if provided
        social_links = []
        if linkedin:
            social_links.append(SocialLink(user_profile=profile, platform='linkedin', url=linkedin))
        if facebook:
            social_links.append(SocialLink(user_profile=profile, platform='facebook', url=facebook))
        if twitter:
            social_links.append(SocialLink(user_profile=profile, platform='twitter', url=twitter))
        
        if social_links:
            SocialLink.objects.bulk_create(social_links)
        
        return profile
    
    def update(self, instance, validated_data):
        # Extract social links data
        linkedin = validated_data.pop('linkedin', None)
        facebook = validated_data.pop('facebook', None)
        twitter = validated_data.pop('twitter', None)
        
        # Update profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update social links
        if linkedin is not None:
            SocialLink.objects.update_or_create(
                user_profile=instance, platform='linkedin',
                defaults={'url': linkedin}
            )
        if facebook is not None:
            SocialLink.objects.update_or_create(
                user_profile=instance, platform='facebook',
                defaults={'url': facebook}
            )
        if twitter is not None:
            SocialLink.objects.update_or_create(
                user_profile=instance, platform='twitter',
                defaults={'url': twitter}
            )
        
        return instance
    

class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)


class ProfileShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileShare
        fields = ['share_token', 'recipient_email', 'expires_at']
        read_only_fields = ['share_token', 'expires_at']


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'name',
            'profile_pic',
            'job_title',
            'job_specialization',
            'rating',
            'subscription_type',
            'email',
            'mobile',
            'services',
            'experiences',
            'skills',
            'tools',
            'education',
            'certifications',
            'portfolio',
            'video_intro'
        ]



