from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (RegisterView, CustomLoginView, ReviewViewSet,createaccount, CheckProfileStatusView, get_profile,RequestResetPasswordView, PasswordResetConfirmView,LogoutView, UpdateProfileView
)
router = DefaultRouter()
# You can re-enable the UserProfileViewSet route if needed later
# router.register(r'profiles', UserProfileViewSet, basename='profiles')
router.register(r'reviews', ReviewViewSet, basename='reviews')
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('createaccount/', createaccount, name='create-account'),
    path('profile_status/', CheckProfileStatusView.as_view(), name='profile-status'),
    path('get_profile/', get_profile, name='get-profile'),
    path('update_profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('request-reset-password/', RequestResetPasswordView.as_view(), name='request-reset-password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/', include(router.urls)),
]
