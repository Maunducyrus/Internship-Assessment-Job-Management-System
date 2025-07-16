# Create your views here.
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer, JobUpdateSerializer

class JobListCreateView(generics.ListCreateAPIView):
    """
    GET: List all active jobs with optional filtering
    POST: Create a new job
    """
    serializer_class = JobSerializer
    
    def get_queryset(self):
        queryset = Job.objects.filter(status='active')
        
        # filtering
        location = self.request.query_params.get('location', None)
        company = self.request.query_params.get('company', None)
        search = self.request.query_params.get('search', None)
        
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        if company:
            queryset = queryset.filter(company_name__icontains=company)
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(company_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save()
            response_serializer = JobSerializer(job)
            return Response(
                {
                    'message': 'Job created successfully',
                    'data': response_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'message': 'Failed to create job',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class JobDetailView(generics.RetrieveAPIView):
    """
    GET: Retrieve details of a single job (active or inactive)
    """
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'message': 'Job retrieved successfully',
            'data': serializer.data
        })

class JobUpdateView(generics.UpdateAPIView):
    """
    PUT/PATCH: Update a job
    """
    queryset = Job.objects.all()
    serializer_class = JobUpdateSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            job = serializer.save()
            response_serializer = JobSerializer(job)
            return Response({
                'message': 'Job updated successfully',
                'data': response_serializer.data
            })
        
        return Response(
            {
                'message': 'Failed to update job',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PATCH'])
def deactivate_job(request, pk):
    """
    PATCH: Soft delete a job by setting status to inactive
    """
    try:
        job = get_object_or_404(Job, pk=pk)
        
        if job.status == 'inactive':
            return Response(
                {
                    'message': 'Job is already inactive',
                    'data': JobSerializer(job).data
                },
                status=status.HTTP_200_OK
            )
        
        job.soft_delete()
        return Response(
            {
                'message': 'Job deactivated successfully',
                'data': JobSerializer(job).data
            },
            status=status.HTTP_200_OK
        )
    
    except Job.DoesNotExist:
        return Response(
            {'message': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PATCH'])
def activate_job(request, pk):
    """
    PATCH: Activate a job by setting status to active
    """
    try:
        job = get_object_or_404(Job, pk=pk)
        
        if job.status == 'active':
            return Response(
                {
                    'message': 'Job is already active',
                    'data': JobSerializer(job).data
                },
                status=status.HTTP_200_OK
            )
        
        job.activate()
        return Response(
            {
                'message': 'Job activated successfully',
                'data': JobSerializer(job).data
            },
            status=status.HTTP_200_OK
        )
    
    except Job.DoesNotExist:
        return Response(
            {'message': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def job_stats(request):
    """
    GET: Get job statistics
    """
    active_jobs = Job.objects.filter(status='active').count()
    inactive_jobs = Job.objects.filter(status='inactive').count()
    total_jobs = Job.objects.count()
    
    return Response({
        'message': 'Job statistics retrieved successfully',
        'data': {
            'active_jobs': active_jobs,
            'inactive_jobs': inactive_jobs,
            'total_jobs': total_jobs
        }
    })
