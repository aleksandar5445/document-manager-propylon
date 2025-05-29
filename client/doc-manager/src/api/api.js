
// API functions for the document management system
// These functions interact with the backend API to perform actions like login, fetching file versions, downloading files, and uploading files.

const API_BASE_URL = "http://localhost:8001/api";

export async function loginApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth-token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

// This function fetches the file versions for a given user token.
export async function fetchFileVersions(token) {
  const response = await fetch(`${API_BASE_URL}/file_versions/`, {
    headers: { Authorization: "Token " + token },
  });
  if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
  return response.json();
}

// This function fetches the file versions for a specific parent URL.
export async function downloadFile(token, parent_url, version_number) {
  let url = `${API_BASE_URL}/files/download/?parent_url=${encodeURIComponent(parent_url)}&revision=${version_number}`;
  const response = await fetch(url, {
    headers: { Authorization: "Token " + token },
  });
  if (!response.ok) throw new Error("Failed to download file");
  return response.blob();
}

// This function uploads a file to the server, associating it with a specific parent URL.
export async function uploadFile(token, file, parentUrl) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("parent_url", parentUrl);
  const response = await fetch(`${API_BASE_URL}/files/upload/`, {
    method: "POST",
    headers: { Authorization: "Token " + token },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "Upload failed");
  }
  return response.json();
}