from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CustomLoginView,
    UserProfileViewSet,
    ReviewViewSet,
    createaccount,
    get_profile,  # ✅ Import update_profile correctly
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profiles')
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('createaccount/', createaccount, name='create-account'),
    path('api/get-profile/', get_profile, name='update-profile'),  # ✅ FIXED: moved above or below API include
    path('', include(router.urls)),
    path('api/', include(router.urls)),
]
