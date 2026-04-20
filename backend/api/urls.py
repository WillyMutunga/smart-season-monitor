from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    FieldViewSet, FieldUpdateViewSet, UserViewSet, 
    DashboardStatsView, RegisterView, PromoteAgentView, 
    AgentManagementView, ProfileView, ChangePasswordView, AnalyticsView
)

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'updates', FieldUpdateViewSet, basename='update')
router.register(r'agents', UserViewSet, basename='agent')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', DashboardStatsView.as_view(), name='stats'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('promote/<int:pk>/', PromoteAgentView.as_view(), name='promote'),
    path('agent-management/', AgentManagementView.as_view(), name='agent-management'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
