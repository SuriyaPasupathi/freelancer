from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    google_id = models.CharField(max_length=255, null=True, blank=True)
    is_google_user = models.BooleanField(default=False)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    token_created_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    SUBSCRIPTION_CHOICES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    rating = models.FloatField(default=0)
    reviews = models.TextField(blank=True)

    subscription_type = models.CharField(max_length=10, choices=SUBSCRIPTION_CHOICES, default='free')

    # Basic Plan fields
    about = models.TextField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    dob = models.DateField(null=True, blank=True)

    # Premium Plan fields
    skills = models.TextField(blank=True)
    education_history = models.TextField(blank=True)
    experience_history = models.TextField(blank=True)

    def __str__(self):
        return self.user.username