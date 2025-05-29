import React, { useState, useContext, useRef } from "react";
import { AppContext } from "./AppContext";
import { uploadFile } from "./api/api";

/** 
 * * UploadFile component allows users to upload files to a specified parent URL.
 * * It includes a file input, a text input for the parent URL, and a submit button.
 * * * Props:
 * * - onUpload: callback function to be called after a successful upload (used to refresh the file list).
*/
function UploadFile({ onUpload }) {
  const { token } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [parentUrl, setParentUrl] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    // Basic validation: ensure file and parentUrl are provided
    if (!file || !parentUrl) {
      setStatus("Select file and parent_url!");
      return;
    }

    try {
      // Call the uploadFile function with the token, file, and parentUrl
      await uploadFile(token, file, parentUrl);
      setMessage("Upload successful!");
      setParentUrl("");
      setFile(null);

      // Reset file input to allow re-uploading
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // if provided, call the onUpload callback to refresh the file list
      if (onUpload) onUpload();
    } catch (error) {
      setMessage(error.message || "Upload failed! Please try again.");
      console.error("Upload error:", error);
    }
  };

  // Render the upload form with input fields for parent URL and file selection
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
            ref={fileInputRef}
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
