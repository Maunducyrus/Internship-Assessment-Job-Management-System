from django.urls import path
from . import views

urlpatterns = [
    # Main CRUD endpoints
    path('jobs/', views.JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('jobs/<int:pk>/update/', views.JobUpdateView.as_view(), name='job-update'),
    
    # Soft delete and activation endpoints
    path('jobs/<int:pk>/deactivate/', views.deactivate_job, name='job-deactivate'),
    path('jobs/<int:pk>/activate/', views.activate_job, name='job-activate'),
    
    # Statistics endpoint
    path('jobs/stats/', views.job_stats, name='job-stats'),
]