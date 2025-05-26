import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import './App.css';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/api/auth-token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      login(data.token);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

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
