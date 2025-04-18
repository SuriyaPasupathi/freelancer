from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomLoginView, MyAccountView, ForgotPasswordView, ResetPasswordView
from .views import views
router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet)
router.register(r'reviews', views.ReviewViewSet)
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),  # <-- Add this!
    path('me/', MyAccountView.as_view(), name='me'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
