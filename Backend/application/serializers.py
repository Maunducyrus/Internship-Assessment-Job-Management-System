from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'description',
            'company_name',
            'location',
            'salary',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_salary(self, value):
        """Validate that salary is positive"""
        if value <= 0:
            raise serializers.ValidationError("Salary must be a positive number.")
        return value
    
    def validate_title(self, value):
        """Validate that title is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()
    
    def validate_company_name(self, value):
        """Validate that company name is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Company name cannot be empty.")
        return value.strip()
    
    def validate_location(self, value):
        """Validate that location is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value.strip()

class JobCreateSerializer(JobSerializer):
    """Serializer for creating jobs - excludes status field from input"""
    class Meta(JobSerializer.Meta):
        fields = [
            'id',
            'title',
            'description',
            'company_name',
            'location',
            'salary',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class JobUpdateSerializer(JobSerializer):
    """Serializer for updating jobs - allows partial updates"""
    class Meta(JobSerializer.Meta):
        fields = [
            'id',
            'title',
            'description',
            'company_name',
            'location',
            'salary',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make all fields optional for partial updates
        for field in self.fields:
            self.fields[field].required = False