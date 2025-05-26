import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./FileVersions.css";
import UploadFile from "./UploadFile";


function FileVersionsList(props) {
  const { token } = useContext(AuthContext);
  const file_versions = props.file_versions;

  const handleDownload = async (parent_url, version_number, file_name) => {
    // make sure that parent_url is properly encoded 
    let url = `http://localhost:8001/api/files/download/?parent_url=${encodeURIComponent(parent_url)}&revision=${version_number}`;
    const response = await fetch(url, {
      headers: {
        Authorization: "Token " + token,
      },
    });
    // if the response is not ok, alert the user
    if (!response.ok) {
      alert("Failed to download file.");
      return;
    }

    // create a blob from the response and download it
    // create a link element, set its href to the blob URL, and trigger a download
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return file_versions.map((file_version) => (
    <div className="file-version" key={file_version.id}>
      <h2>File Name: {file_version.file_name}</h2>
      <p>
        ID: {file_version.id} Version: {file_version.version_number}
      </p>
      <p>
        Read: {file_version.can_read ? "✅" : "❌"} |
        Write: {file_version.can_write ? "✅" : "❌"}
      </p>
      <button
        onClick={() =>
          handleDownload(file_version.parent_url, file_version.version_number, file_version.file_name)
        }
      >
        Download
      </button>
    </div>
  ));
}

function FileVersions() {
  const [data, setData] = useState([]);
  const { token, logout } = useContext(AuthContext);

  const fetchData = async () => {
    const response = await fetch("http://localhost:8001/api/file_versions/", {
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div>
      <div className="logoutButton">
        <button className="buttonStartClass" onClick={logout}>Logout</button>
      </div>
      <div className="Header">
        <h1>
          Document Manager</h1>
      </div>
      <UploadFile onUpload={fetchData} />
      <h2>Found {data.length} File Versions</h2>
      <FileVersionsList file_versions={data} />
    </div>
  );
}

export default FileVersions;
