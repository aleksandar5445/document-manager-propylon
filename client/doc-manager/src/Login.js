import React, { useState, useContext } from "react";
import './App.css';
import { loginApi } from "./api/api";
import { AppContext } from "./AppContext";

/**
 * Login component allows users to authenticate using their email and password.
 * On successful login, it updates the authentication context with the new token.
 */
function Login() {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  /**
   * Handles form submission for user login.
   * Calls the loginApi function, updates auth context, and handles errors.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Call the API layer to authenticate the user
      const data = await loginApi(email, password);
      // Save the token to auth context
      login(data.token);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  // Render the login form with inputs for email and password
  return (
    <form onSubmit={handleSubmit}>
      <div className="Login">
        <h2 className="App-logo">Login</h2>
        <p>Enter your email and password to log in.</p>
        <div className="Login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="Login-button" type="submit">Log In</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </form>
  );
}

export default Login;
