import React, { createContext, useState, useEffect } from "react";
import { fetchFileVersions } from "./api/api";
/**
 * AppContext provides global state management for authentication and file data.
 * 
 * - token: authentication token
 * - isAuthenticated: login status (true/false)
 * - login: function to log user in
 * - logout: function to log user out
 * - fileList: array of file objects from the backend
 * - setFileList: function to set file list manually
 * - loading: boolean, true if fetching files is in progress
 * - error: string, error message for file operations
 * - loadFiles: function to fetch file list from backend
 */

export const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication token, persisted in localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  // File list state
  const [fileList, setFileList] = useState([]);
  // Loading state for file operations
  const [loading, setLoading] = useState(false);
  // Error state for file operations
  const [error, setError] = useState("");

  /**
  * Effect: Reacts to token changes (login/logout).
  * On login, marks user as authenticated, saves token to localStorage, and loads file list.
  * On logout, clears token, marks user as unauthenticated, clears file list, and removes token from localStorage.
  */
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      loadFiles(token);
    } else {
      setIsAuthenticated(false);
      setFileList([]);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  /**
  * Loads the file list from the backend API.
  * Sets loading state, handles errors, and updates fileList state.
  * @param {string} [tkn=token] - Token for authentication; defaults to current token
  */
  const loadFiles = async (tkn = token) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFileVersions(tkn);
      setFileList(data);
    } catch (e) {
      setError("Failed to fetch files.");
      setFileList([]);
    }
    setLoading(false);
  };

  return (
    <AppContext.Provider value={{
      token, isAuthenticated, login, logout,
      fileList, setFileList,
      loading, error, loadFiles
    }}>
      {children}
    </AppContext.Provider>
  );
}
