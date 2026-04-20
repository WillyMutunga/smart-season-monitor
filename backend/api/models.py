from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('AGENT', 'Field Agent'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='AGENT')
    last_activity = models.DateTimeField(null=True, blank=True)

class Field(models.Model):
    STAGE_CHOICES = (
        ('PLANTED', 'Planted'),
        ('GROWING', 'Growing'),
        ('READY', 'Ready'),
        ('HARVESTED', 'Harvested'),
    )
    
    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=255)
    planting_date = models.DateField()
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='PLANTED')
    assigned_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_fields')
    
    @property
    def status(self):
        # Logic for computed status
        if self.current_stage == 'HARVESTED':
            return 'Completed'
        
        # Check for "At Risk" keywords in latest updates
        latest_update = self.updates.order_by('-created_at').first()
        if latest_update and any(word in latest_update.notes.lower() for word in ['pest', 'disease', 'dry', 'wither', 'yellow']):
            return 'At Risk'
            
        return 'Active'

    def __str__(self):
        return self.name

class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
    stage = models.CharField(max_length=20, choices=Field.STAGE_CHOICES)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.field.name} - {self.stage} at {self.created_at}"
