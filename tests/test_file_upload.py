import io
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from tests.factories import UserFactory
from propylon_document_manager.file_versions.models import FileVersion

# Test cases for file upload functionality in the API 
@pytest.mark.django_db
def test_authenticated_user_can_upload_file():
    # 1. Create user 
    user = UserFactory(password="testpass123")

    # 2. Login user and get token 
    client = APIClient()
    response = client.post('/auth-token/', {
        "username": user.email,
        "password": "testpass123",
    })
    assert response.status_code == 200
    token = response.json()["token"]

    # 3. Uset token for authenticated requests 
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    # 4. Fake file upload 
    test_file = io.BytesIO(b"dummy data for test file")
    test_file.name = "testfile.txt"

    response = client.post(
        '/api/files/upload/',
        {
            "parent_url": "/documents/tests/testfile.txt",
            "file": test_file
        },
        format='multipart'
    )

    # 5. Check response
    assert response.status_code == 201
    data = response.json()
    assert data["file_name"] == "testfile.txt"
    assert data["parent_url"] == "/documents/tests/testfile.txt"
    assert data["version_number"] == 0

# 6. Check if file is saved correctly with the correct owner 
@pytest.mark.django_db
def test_upload_unauthenticated_fails():
    client = APIClient()
    test_file = io.BytesIO(b"dummy data for test file")
    test_file.name = "unauth.txt"
    response = client.post(
        '/api/files/upload/',
        {
            "parent_url": "/documents/tests/unauth.txt",
            "file": test_file
        },
        format='multipart'
    )
    assert response.status_code in [401, 403]  # Unauthorized or Forbidden

# Test cases for versioning functionality 
@pytest.mark.django_db
def test_upload_twice_increments_version_number():
    user = UserFactory(password="testpass123")
    client = APIClient()
    response = client.post('/auth-token/', {
        "username": user.email,
        "password": "testpass123",
    })
    token = response.json()["token"]
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    test_file = io.BytesIO(b"dummy data v1")
    test_file.name = "versioned.txt"
    parent_url = "/documents/tests/versioned.txt"

    # Prvi upload
    response1 = client.post(
        '/api/files/upload/',
        {
            "parent_url": parent_url,
            "file": test_file
        },
        format='multipart'
    )
    assert response1.status_code == 201
    assert response1.json()["version_number"] == 0

    # Second upload should increment version number
    test_file2 = io.BytesIO(b"dummy data v2")
    test_file2.name = "versioned.txt"
    response2 = client.post(
        '/api/files/upload/',
        {
            "parent_url": parent_url,
            "file": test_file2
        },
        format='multipart'
    )
    assert response2.status_code == 201
    assert response2.json()["version_number"] == 1

# Test cases for retrieving file versions 
@pytest.mark.django_db
def test_get_file_versions_filters_by_owner():
    user1 = UserFactory(password="pass123")
    user2 = UserFactory(password="pass456")

    # Dodaj file za oba usera
    fv1 = FileVersion.objects.create(
        owner=user1,
        file_name="u1.txt",
        version_number=0,
        parent_url="/docs/u1.txt"
    )
    fv2 = FileVersion.objects.create(
        owner=user2,
        file_name="u2.txt",
        version_number=0,
        parent_url="/docs/u2.txt"
    )

    client = APIClient()
    response = client.post('/auth-token/', {
        "username": user1.email,
        "password": "pass123",
    })
    token = response.json()["token"]
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    # User1 sme da vidi samo svoj fajl
    response = client.get('/api/file_versions/')
    assert response.status_code == 200
    file_names = [f["file_name"] for f in response.json()]
    assert "u1.txt" in file_names
    assert "u2.txt" not in file_names