from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from .models import User, Field, FieldUpdate
from .serializers import UserSerializer, FieldSerializer, FieldUpdateSerializer, ChangePasswordSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.save(role='AGENT')

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get('old_password')):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({"status": "password set"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        fields = Field.objects.all()
        
        # Crop Distribution
        crop_counts = fields.values('crop_type').annotate(count=Count('id')).order_by('-count')
        
        # Stage Breakdown
        stage_counts = fields.values('current_stage').annotate(count=Count('id')).order_by('current_stage')
        
        # Agent Activity (Updates logged)
        agent_activity = User.objects.filter(role='AGENT').annotate(
            update_count=Count('fieldupdate')
        ).values('username', 'first_name', 'last_name', 'update_count').order_by('-update_count')

        # Status breakdown
        active = 0
        at_risk = 0
        completed = 0
        for f in fields:
            s = f.status
            if s == 'Active': active += 1
            elif s == 'At Risk': at_risk += 1
            else: completed += 1

        return Response({
            "crop_distribution": crop_counts,
            "stage_breakdown": stage_counts,
            "agent_activity": agent_activity,
            "status_summary": {
                "active": active,
                "at_risk": at_risk,
                "completed": completed
            }
        })

class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Field.objects.none()
        if user.role == 'ADMIN':
            return Field.objects.all().order_by('-planting_date')
        return Field.objects.filter(assigned_agent=user).order_by('-planting_date')

    def perform_create(self, serializer):
        if self.request.user.role != 'ADMIN':
            raise permissions.PermissionDenied("Only admins can create fields")
        serializer.save()

class FieldUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = FieldUpdateSerializer
    queryset = FieldUpdate.objects.all()

    def perform_create(self, serializer):
        field = serializer.validated_data['field']
        if self.request.user.role != 'ADMIN' and field.assigned_agent != self.request.user:
            raise permissions.PermissionDenied("You are not assigned to this field.")
            
        update = serializer.save(created_by=self.request.user)
        field.current_stage = update.stage
        field.save()

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(role='AGENT')
    permission_classes = [IsAdminUser]

class PromoteAgentView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.role = 'ADMIN'
            user.save()
            return Response({"status": "promoted"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class AgentManagementView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        agents = User.objects.filter(role='AGENT').prefetch_related('assigned_fields')
        now = timezone.now()
        five_minutes_ago = now - timedelta(minutes=5)
        
        data = []
        for agent in agents:
            is_online = agent.last_activity and agent.last_activity >= five_minutes_ago
            assignments = [f.name for f in agent.assigned_fields.all()]
            data.append({
                "id": agent.id,
                "username": agent.username,
                "full_name": f"{agent.first_name} {agent.last_name}",
                "is_online": bool(is_online),
                "last_activity": agent.last_activity,
                "assignments": assignments
            })
        return Response(data)

class DashboardStatsView(APIView):
    def get(self, request):
        user = request.user
        if user.role == 'ADMIN':
            fields = Field.objects.all()
        else:
            fields = Field.objects.filter(assigned_agent=user)
            
        total_fields = fields.count()
        active_count = 0
        at_risk_count = 0
        completed_count = 0
        for f in fields:
            s = f.status
            if s == 'Active': active_count += 1
            elif s == 'At Risk': at_risk_count += 1
            else: completed_count += 1
            
        stage_breakdown = fields.values('current_stage').annotate(count=Count('id'))
        
        return Response({
            'total_fields': total_fields,
            'status_breakdown': {
                'active': active_count,
                'at_risk': at_risk_count,
                'completed': completed_count
            },
            'stage_breakdown': stage_breakdown,
            'role': user.role
        })
