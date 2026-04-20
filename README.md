# SmartSeason Field Monitoring System

A simple yet powerful web application to track crop progress across multiple fields during a growing season.

## Core Features
- **Role-Based Access**: Specialized dashboards for Admins (Coordinators) and Field Agents.
- **Field Management**: Create and assign fields to agents with detailed crop tracking.
- **Real-time Status Logic**: Automated field health calculation based on stage and observations.
- **Update History**: Audit trail of all observations and stage changes.
- **Insights Dashboard**: Visual summaries of field status and crop distribution.

## Technical Stack
- **Backend**: Django & Django REST Framework
- **Frontend**: React (Vite), Framer Motion (Animations), Lucide (Icons)
- **Database**: SQLite (configured for easy portability to PostgreSQL)
- **Auth**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+

### Setup Instructions

#### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers psycopg2-binary djangorestframework-simplejwt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Seed initial data:
   ```bash
   python seed.py
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

#### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Demo Credentials
- **Admin**: `admin` / `admin123`
- **Field Agent**: `agent1` / `agent123`

## Design Decisions & Assumptions
- **Status Logic**: We implemented a keyword-based observation scanner. If an agent includes words like "pest", "disease", or "yellow" in their latest note, the field is automatically marked as **At Risk**. This allows for proactive monitoring without manual flag-setting.
- **Premium UI**: Used "Glassmorphism" and "Vanilla CSS" to ensure a lightweight, modern, and high-performance user interface.
- **JWT Auth**: Chose JWT to decouple the frontend and backend, allowing for easy scalability or future mobile integration.
