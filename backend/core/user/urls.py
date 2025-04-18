from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomLoginView, UserProfileViewSet, ReviewViewSet,createaccount

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
      path('createaccount/', createaccount, name='create-account'),
    path('', include(router.urls)),  # ✅ include ViewSet-based routes
]
