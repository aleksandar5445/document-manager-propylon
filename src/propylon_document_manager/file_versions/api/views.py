from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from ..models import FileVersion
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from .serializers import FileVersionSerializer
from rest_framework import filters
import hashlib

from ..models import FileVersion
from .serializers import FileVersionSerializer

class FileVersionViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    """
    API endpoint for retrieving/listing file versions for the authenticated user only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FileVersionSerializer
    queryset = FileVersion.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['parent_url']

    def get_queryset(self):
        user = self.request.user
        return FileVersion.objects.filter(owner=user)

    lookup_field = "id"

class FileUploadAPIView(APIView):
    """
    Upload a file to a given URL for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        parent_url = request.data.get('parent_url')
        file = request.FILES.get('file')
        if not parent_url or not file:
            return Response({'error': 'parent_url and file are required.'}, status=400)

        file_name = file.name

        # Get latest version for this user/parent_url
        latest = FileVersion.objects.filter(owner=request.user, parent_url=parent_url).order_by('-version_number').first()
        version = (latest.version_number + 1) if latest else 0

        # Content hash (Content Addressable Storage)
        file.seek(0)
        content_hash = hashlib.sha256(file.read()).hexdigest()
        file.seek(0)  # reset pointer!

        file_version = FileVersion.objects.create(
            owner=request.user,
            file_name=file_name,
            version_number=version,
            file=file,
            parent_url=parent_url,
            content_hash=content_hash,
        )
        serializer = FileVersionSerializer(file_version)
        return Response(serializer.data, status=201)