from django.shortcuts import render
from rest_framework.views import APIView
from django.http import FileResponse, Http404
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

    def get_queryset(self):
        user = self.request.user
        queryset = FileVersion.objects.filter(owner=user)

        parent_url = self.request.query_params.get("parent_url")
        if parent_url:
            queryset = queryset.filter(parent_url=parent_url)

        revision = self.request.query_params.get("revision")
        if revision is not None:
            queryset = queryset.filter(version_number=int(revision))

        return queryset

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
    

class FileDownloadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        parent_url = request.query_params.get('parent_url')
        revision = request.query_params.get('revision')

        if not parent_url:
            return Response({'error': 'parent_url is required.'}, status=400)

        try:
            qs = FileVersion.objects.filter(owner=request.user, parent_url=parent_url)
            if revision is not None:
                qs = qs.filter(version_number=int(revision))
            else:
                qs = qs.order_by('-version_number')
        except ValueError:
            return Response({'error': 'revision must be an integer.'}, status=400)

        file_version = qs.first()
        if not file_version or not file_version.file:
            raise Http404("File not found")

        response = FileResponse(
            file_version.file,
            as_attachment=True,
            filename=file_version.file_name
        )
        return response
