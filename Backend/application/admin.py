# Register your models here.

from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'company_name',
        'location',
        'salary',
        'status',
        'created_at',
        'updated_at'
    ]
    list_filter = ['status', 'created_at', 'company_name', 'location']
    search_fields = ['title', 'company_name', 'location', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'description', 'company_name', 'location', 'salary')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Show all jobs (active and inactive) in admin"""
        return Job.objects.all()
    
    actions = ['make_active', 'make_inactive']
    
    def make_active(self, request, queryset):
        """Admin action to activate selected jobs"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} jobs were successfully activated.')
    make_active.short_description = "Mark selected jobs as active"
    
    def make_inactive(self, request, queryset):
        """Admin action to deactivate selected jobs"""
        updated = queryset.update(status='inactive')
        self.message_user(request, f'{updated} jobs were successfully deactivated.')
    make_inactive.short_description = "Mark selected jobs as inactive"