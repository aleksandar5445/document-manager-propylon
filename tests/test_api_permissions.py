import io
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from propylon_document_manager.file_versions.models import User, FileVersion


class FileVersionPermissionsAPITest(APITestCase):
    def setUp(self):
        # Create a test user and token for authentication 
        self.user = User.objects.create_user(email="testcase@gmail.com", password="Test1234", name="TestCase")
        self.token = Token.objects.create(user=self.user)
        self.api_auth_header = {"HTTP_AUTHORIZATION": f"Token {self.token.key}"}

        # Set up a parent URL and file content for testing
        # This URL should correspond to a valid document in your system
        self.parent_url = "/documents/test.pdf"
        self.file_content = io.BytesIO(b"Test file content")
        self.file_content.name = "testfile.pdf"

    def test_upload_file_with_write_permission(self):
        # First upload a file
        url = reverse("api:file-upload")
        self.file_content.seek(0)
        response = self.client.post(
            url,
            {"file": self.file_content, "parent_url": self.parent_url},
            format="multipart",
            **self.api_auth_header
        )
        self.assertEqual(response.status_code, 201)
        file_version_id = response.data["id"]

        # Set can_write to False
        fv = FileVersion.objects.get(pk=file_version_id)
        fv.can_write = False
        fv.save()

        # Try to upload again without write permission 
        self.file_content.seek(0)
        response = self.client.post(
            url,
            {"file": self.file_content, "parent_url": self.parent_url},
            format="multipart",
            **self.api_auth_header
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("write permission", response.data["error"])

    def test_download_file_with_read_permission(self):
        # First upload a file
        url_upload = reverse("api:file-upload")
        self.file_content.seek(0)
        upload_response = self.client.post(
            url_upload,
            {"file": self.file_content, "parent_url": self.parent_url},
            format="multipart",
            **self.api_auth_header
        )
        self.assertEqual(upload_response.status_code, 201)
        file_version_id = upload_response.data["id"]

        # Set can_read to False
        fv = FileVersion.objects.get(pk=file_version_id)
        fv.can_read = False
        fv.save()

       # Try to download the file without read permission 
        url_download = reverse("api:file-download")
        response = self.client.get(
            url_download,
            {"parent_url": self.parent_url, "revision": 0},
            **self.api_auth_header
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("read permission", response.data["error"])
