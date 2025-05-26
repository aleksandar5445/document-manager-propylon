from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from django.urls import path
from propylon_document_manager.file_versions.api.views import (
    FileUploadAPIView,
    FileDownloadAPIView,
    FileVersionViewSet,
    CustomAuthTokenView
)


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("file_versions", FileVersionViewSet)


app_name = "api"
urlpatterns = router.urls

# Add the file upload endpoint to the urlpatterns
urlpatterns += [
    path("files/upload/", FileUploadAPIView.as_view(), name="file-upload"),
    path("files/download/", FileDownloadAPIView.as_view(), name="file-download"),
    path("auth-token/", CustomAuthTokenView.as_view(), name="custom-auth-token"),
]