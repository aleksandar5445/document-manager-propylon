import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";

function UploadFile({ onUpload }) {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [parentUrl, setParentUrl] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    if (!file || !parentUrl) {
      setStatus("Select file and parent_url!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parent_url", parentUrl);

    try {
      const response = await fetch("http://localhost:8001/api/files/upload/", {
        method: "POST",
        headers: {
          Authorization: "Token " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(
          errorData?.error || "Upload failed! Please try again."
        );
        return;
      }

      setMessage("Upload successful!");
      setParentUrl("");
      setFile(null);

      // Reset file input polje
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUpload) onUpload();
    } catch (error) {
      setMessage("Upload failed due to network or server error.");
      console.error("Upload error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
      <div className="uploadFile">
        <div className="uploadFileInputs">
          <input
            type="text"
            placeholder="parent_url (exp. /documents/review.pdf)"
            value={parentUrl}
            onChange={(e) => setParentUrl(e.target.value)}
            style={{ marginRight: 8, width: "300px", height: "30px", marginBottom: "10px" }}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginRight: 8, }}
          />
        </div>
        <button className="buttonStartClass" type="submit">Upload</button>
      </div>
      {status && <span style={{ marginLeft: 10 }}>{status || message}</span>}
    </form>
  );
}

export default UploadFile;
