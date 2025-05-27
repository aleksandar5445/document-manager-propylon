# Propylon Document Manager Assessment

The Propylon Document Management Technical Assessment is a complete full-stack web application built upon a basic API backend (Django/DRF) and a React-based frontend. This application fulfills all mandatory and bonus requirements defined in the assessment description.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Backend (API) Development](#backend-api-development)
  - [Frontend (Client) Development](#frontend-client-development)
- [API Endpoints](#api-endpoints)
- [Architecture & Implementation Notes](#architecture--implementation-notes)
- [Testing](#testing)
- [Content Addressable Storage](#content-addressable-storage)
- [Permissions](#permissions)
- [Credits](#credits)

---

## Features

- **Stores files of any type and name**
- **Stores files at user-defined URLs (`parent_url`)**
- **Token-based authentication (no anonymous access)**
- **User isolation**: users only see and manage their own files
- **Version control**: multiple revisions of files at the same URL
- **File retrieval**: fetch any revision of a stored file
- **Content Addressable Storage (CAS)**: files stored with SHA-256 content hashes
- **Read/Write permissions** for individual file versions _(bonus feature)_
- **Frontend UI** for uploading, listing, downloading files and their versions
- **Comprehensive unit tests** using pytest and DRF test client
- **Clear and modular code structure**

---

## Getting Started

### Backend (API) Development

**Prerequisites**:

- Python 3.11
- SQLite (default database, can be changed)
- `pip` and `virtualenv`

#### Installation:

1. **Clone the repository** and navigate to the project root.

   ```bash
   git clone <https://github.com/aleksandar5445/document-manager-propylon.git>
   cd document-manager-assessment
   ```

2. **Create and activate the virtual environment**:

   ```bash
   python3.11 -m venv venv
   source venv/bin/activate     # Linux/macOS
   venv\Scripts\activate        # Windows
   ```

3. **Install required dependencies**:

   ```bash
   pip install -r requirements/dev.txt
   ```

4. **Run migrations**:

   ```bash
   python manage.py migrate
   ```

5. **Create a superuser** _(optional, for admin panel)_:

   ```bash
   python manage.py createsuperuser
   ```

6. **Load initial data fixtures** _(optional)_:

   ```bash
   python manage.py loaddata file_versions
   ```

7. **Start the development server**:

   ```bash
   python manage.py runserver 0.0.0.0:8001
   ```

   _(The API runs on port 8001)_

---

### Frontend (Client) Development

**Prerequisites**:

- Node.js v18.19.0 (NVM recommended)

#### Installation:

1. **Navigate to the client directory**:

   ```bash
   cd client/doc-manager
   ```

2. **Use correct Node version** (if using NVM):

   ```bash
   nvm use
   ```

3. **Install frontend dependencies**:

   ```bash
   npm install
   ```

4. **Start the React development server**:

   ```bash
   npm start
   ```

   _(Frontend runs on http://localhost:3000)_

---

## API Endpoints

| Endpoint                          | Method | Description                      | Authentication |
| --------------------------------- | ------ | -------------------------------- | -------------- |
| `/api/auth-token/`                | POST   | Obtain auth token (login)        | No             |
| `/api/files/upload/`              | POST   | Upload files to specified URL    | Yes            |
| `/api/file_versions/`             | GET    | List user's file versions        | Yes            |
| `/api/file_versions/?parent_url=` | GET    | List all versions at URL         | Yes            |
| `/api/file_versions/?revision=`   | GET    | Retrieve specific file revision  | Yes            |
| `/api/files/download/`            | GET    | Download a specific file version | Yes            |

- All file operations require authenticated access.
- Users are restricted to their own uploaded files.

---

## Architecture & Implementation Notes

### Backend:

- **Frameworks:** Django 5.0.1, Django REST Framework
- **User Model:** Custom user model using email as username
- **Data Storage:** SQLite (default, easily changed)
- **Security:** Token-based authentication, file permissions

### Frontend:

- **Frameworks:** React (Create React App), React Hooks, Context API
- **State Management:** React built-in state management via hooks and context
- **UI Components:** Simple, clean UI using CSS modules

### File Management:

- Each file upload at the same URL increments a revision number.
- File versions tracked individually, each with unique SHA-256 hash.

---

## Testing

Unit tests are implemented for all essential backend functionality and are run using `pytest`:

**Running Tests:**

```bash
pytest
```

---

## Content Addressable Storage

Files are stored with their SHA-256 content hash, enabling:

- **Integrity checks**
- **Deduplication support**
- **Retrieval by content-hash** (extendable functionality)

---

## Permissions

Each file version includes:

- **`can_read`** (default: `True`): Controls read access.
- **`can_write`** (default: `True`): Controls write access (extendable permissions model).

---

## Credits

For additional support or clarification, please reach out to:

**Aleksandar Dimitrov**  
Email: [dimitrov5445@gmail.com](mailto:dimitrov5445@gmail.com)

---
