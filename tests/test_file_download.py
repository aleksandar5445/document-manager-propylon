import io
import pytest
from rest_framework.test import APIClient
from tests.factories import UserFactory

@pytest.mark.django_db
def test_authenticated_user_can_download_file():
    # Kreiraj user-a i uploaduj fajl
    user = UserFactory(password="testpass123")
    client = APIClient()
    response = client.post('/api/auth-token/', {
        "email": user.email,
        "password": "testpass123",
    })
    token = response.json()["token"]
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    file_content = b"download test data"
    test_file = io.BytesIO(file_content)
    test_file.name = "download_test.txt"
    upload_response = client.post(
        '/api/files/upload/',
        {
            "parent_url": "/documents/tests/download_test.txt",
            "file": test_file
        },
        format='multipart'
    )
    assert upload_response.status_code == 201

    # Sada testiraj download (latest verzija)
    download_response = client.get(
        '/api/files/download/',
        {
            "parent_url": "/documents/tests/download_test.txt"
        }
    )
    assert download_response.status_code == 200
    # Proveri da li je content isti kao original
    assert download_response.getvalue() == file_content or download_response.content == file_content

@pytest.mark.django_db
def test_unauthenticated_user_cannot_download_file():
    client = APIClient()
    response = client.get(
        '/api/files/download/',
        {
            "parent_url": "/documents/tests/download_test.txt"
        }
    )
    assert response.status_code in [401, 403]  # unauthorized or forbidden
