from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomLoginView, UserProfileViewSet, ReviewViewSet, createaccount, CheckProfileStatusView,get_profile,RequestResetPasswordView,PasswordResetConfirmView,LogoutView

router = DefaultRouter()
# router.register(r'profiles', UserProfileViewSet, basename='profiles')
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('createaccount/', createaccount, name='create-account'),
    path('profile_status/', CheckProfileStatusView.as_view(), name='profile-status'),
    path('get_profile/', get_profile, name='get-profile'),
    path('request-reset-password/', RequestResetPasswordView.as_view(), name='request-reset-password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/', include(router.urls))  # ✅ Stick to this pattern
]

