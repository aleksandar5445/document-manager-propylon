import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./AppContext";
import "./FileVersions.css";
import UploadFile from "./UploadFile";
import { downloadFile } from "./api/api";

/*** 
 *  Display a list of file versions with download functionality for each version.
 * 
 * props: array of file versions, each containing:
 * {
 *   id: string,
 *  file_name: string,
 *  version_number: number,
 * parent_url: string,
 * upload_time: string,
 * can_read: boolean,
 * can_write: boolean
 * }
 * 
*/
function FileVersionsList({ file_versions }) {
  const { token } = useContext(AppContext);

  // Function to handle file download
  // It takes the parent URL, version number, and file name as parameters
  const handleDownload = async (parent_url, version_number, file_name) => {
    try {
      const blob = await downloadFile(token, parent_url, version_number);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download file: " + error.message);
    }
  };

  // Render each file version with its details and a download button 
  return file_versions.map((file_version) => (
    <div className="file-version" key={file_version.id}>
      <h2>File Name: {file_version.file_name}</h2>
      <div className="file-version-details">
        <p>
          ID: {file_version.id} Version: {file_version.version_number}
        </p>
        <p>
          Parent URL: {file_version.parent_url}
        </p>
        <p>
          Created At: {new Date(file_version.upload_time).toLocaleString()}
        </p>
      </div>
      <p>
        Read: {file_version.can_read ? "✅" : "❌"} |
        Write: {file_version.can_write ? "✅" : "❌"}
      </p>
      <button
        className="buttonStartClass"
        onClick={() =>
          handleDownload(
            file_version.parent_url,
            file_version.version_number,
            file_version.file_name
          )
        }
      >
        Download
      </button>
    </div>
  ));
}

/**
 * Main container component for the document management interface.
 * Handles authentication, file version fetching, file uploading, and logout.
 *
 * Responsibilities:
 * - Fetches the list of all file versions for the authenticated user.
 * - Allows uploading new files via the UploadFile component.
 * - Provides logout functionality.
 * - Renders the list of file versions using FileVersionsList.
 */
function FileVersions() {
  const {
    token,
    logout,
    fileList,
    loadFiles,
    loading,
    error
  } = useContext(AppContext);

  useEffect(() => {
    if (token) loadFiles();
  }, [token]);

  // Render the logout button, upload component, file version count, and list
  return (
    <div>
      <div className="logoutButton">
        <button className="buttonStartClass" onClick={logout}>Logout</button>
      </div>
      <div className="Header">
        <h1>
          Document Manager</h1>
      </div>
      <UploadFile onUpload={loadFiles} />
      {loading ? (
        <p>Loading file versions...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : fileList.length === 0 ? (
        <p>No file versions found. Please upload a file.</p>
      ) : (
        <>
          <h2>Found {fileList.length} File Versions</h2>
          <FileVersionsList file_versions={fileList} />
        </>
      )}
    </div>
  );
}

export default FileVersions;
