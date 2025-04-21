from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomLoginView, UserProfileViewSet, ReviewViewSet, createaccount, CheckProfileStatusView,get_profile

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profiles')
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('createaccount/', createaccount, name='create-account'),
    path('profile_status/', CheckProfileStatusView.as_view(), name='profile-status'),
    path('get_profile/', get_profile, name='get-profile'),
    path('api/', include(router.urls))  # ✅ Stick to this pattern
]

