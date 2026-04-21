from rest_framework import serializers
from .models import User, Field, FieldUpdate

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'role', 'first_name', 'last_name', 'email')
        read_only_fields = ('role',)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class FieldUpdateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.first_name')
    
    class Meta:
        model = FieldUpdate
        fields = ('id', 'field', 'stage', 'notes', 'created_at', 'created_by', 'created_by_name')
        read_only_fields = ('created_at', 'created_by')

class FieldSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    assigned_agent_name = serializers.ReadOnlyField(source='assigned_agent.username')
    updates = FieldUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Field
        fields = ('id', 'name', 'crop_type', 'planting_date', 'current_stage', 'assigned_agent', 'assigned_agent_name', 'status', 'updates')
