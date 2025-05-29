# Propylon Document Manager — Frontend (React)

This is the React-based frontend application for the Propylon Document Manager Technical Assessment.

It provides a user-friendly interface to interact with the backend API built using Django and Django REST Framework, facilitating authentication, file uploads, listing file versions, and downloading specific files.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)

  - [Installation](#installation)
  - [Running in Development Mode](#running-in-development-mode)
  - [Building for Production](#building-for-production)

- [Configuration](#configuration)
- [Architecture & State Management](#architecture--state-management)
- [Components Overview](#components-overview)
- [API Integration](#api-integration)
- [Credits](#credits)

---

## Features

- **Authentication:** Secure, token-based user authentication (email & password).
- **File Uploads:** Upload files to user-specified paths (`parent_url`).
- **File Versioning:** View a complete list of uploaded files and their multiple versions.
- **File Downloads:** Easily download specific file versions.
- **Permissions Display:** Clearly indicates read and write permissions per file.
- **Global State Management:** Utilizes React Context API to manage state across components.
- **Responsive & Accessible UI:** Simple, clear, and intuitive user interface.

---

## Getting Started

Follow these instructions to set up and run the React frontend locally.

### Installation

**Prerequisites:** Ensure Node.js (v18.19.0 recommended) and npm are installed on your system.

1. **Navigate to the React project directory:**

```bash
cd client/doc-manager
```

2. **Install frontend dependencies:**

```bash
npm install
```

---

### Running in Development Mode

Start the frontend development server:

```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000).

> **Important:** Ensure the backend API server is running at [http://localhost:8001](http://localhost:8001).

---

### Building for Production

To build an optimized production-ready bundle:

```bash
npm run build
```

The output files will be generated in the `build/` directory.

---

## Configuration

- By default, the frontend expects the backend API to run at:

```
http://localhost:8001/api
```

- Adjust this endpoint in the file:

```
src/api/api.js
```

Specifically, change the value of:

```javascript
const API_BASE_URL = "http://localhost:8001/api";
```

---

## Architecture & State Management

- Built with React functional components and hooks.
- Utilizes React Context API for global state management (authentication tokens, user state, file data, loading, and errors).
- Clear separation of concerns between components, context, and API logic.

---

## Components Overview

- **`App.js`**: Main component responsible for routing and app structure.
- **`Login.js`**: Handles user authentication and token management.
- **`FileVersions.js`**: Lists files, versions, permissions, and includes download actions.
- **`UploadFile.js`**: Provides a form for uploading files.
- **`AppContext.js`**: Global state management (authentication and file data context).
- **`api/api.js`**: Service layer for API interactions (authentication, file management).

---

## API Integration

API requests are centralized in `src/api/api.js`. Functions include:

- `loginApi(email, password)` – authenticate and retrieve token.
- `fetchFileVersions(token)` – get the user's file versions list.
- `uploadFile(token, file, parentUrl)` – upload files.
- `downloadFile(token, parentUrl, versionNumber)` – download a specific file version.

All API calls (except login) require authentication.

---

## Credits

For additional support or clarification, please reach out to:

**Aleksandar Dimitrov**
Email: [dimitrov5445@gmail.com](mailto:dimitrov5445@gmail.com)

---
