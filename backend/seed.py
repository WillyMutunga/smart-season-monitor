import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import User, Field, FieldUpdate

def seed():
    # Create Admin
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='ADMIN', first_name='System', last_name='Administrator')
        print("Admin user created: admin / admin123")
    else:
        admin = User.objects.get(username='admin')

    # Create Agents
    agent1, _ = User.objects.get_or_create(username='agent1', defaults={'role': 'AGENT', 'first_name': 'John', 'last_name': 'Doe'})
    agent1.set_password('agent123')
    agent1.save()
    print("Agent 1 created: agent1 / agent123")

    agent2, _ = User.objects.get_or_create(username='agent2', defaults={'role': 'AGENT', 'first_name': 'Jane', 'last_name': 'Smith'})
    agent2.set_password('agent123')
    agent2.save()
    print("Agent 2 created: agent2 / agent123")

    # Create Sample Fields
    f1, _ = Field.objects.get_or_create(
        name='North Valley Corn',
        defaults={
            'crop_type': 'Corn',
            'planting_date': date(2026, 3, 1),
            'current_stage': 'GROWING',
            'assigned_agent': agent1
        }
    )
    
    f2, _ = Field.objects.get_or_create(
        name='East Ridge Soy',
        defaults={
            'crop_type': 'Soybeans',
            'planting_date': date(2026, 3, 15),
            'current_stage': 'PLANTED',
            'assigned_agent': agent1
        }
    )

    f3, _ = Field.objects.get_or_create(
        name='South Hill Wheat',
        defaults={
            'crop_type': 'Wheat',
            'planting_date': date(2026, 2, 10),
            'current_stage': 'READY',
            'assigned_agent': agent2
        }
    )

    # Add an "At Risk" update to North Valley Corn
    FieldUpdate.objects.get_or_create(
        field=f1,
        stage='GROWING',
        notes='Observed some yellowing of leaves. Possible nitrogen deficiency or pests.',
        created_by=agent1
    )

    print("Sample fields and updates created.")

if __name__ == '__main__':
    seed()
