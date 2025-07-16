from django.db import models
from django.utils import timezone

class Job(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    salary = models.IntegerField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'jobs'
    
    def __str__(self):
        return f"{self.title} at {self.company_name}"
    
    def soft_delete(self):
        """Soft delete by setting status to inactive"""
        self.status = 'inactive'
        self.save()
    
    def activate(self):
        """Activate job by setting status to active"""
        self.status = 'active'
        self.save()