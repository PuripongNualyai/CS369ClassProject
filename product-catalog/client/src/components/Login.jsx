import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './Api'; // Importing the custom api instance

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/login", { email, password });

      if (response.status !== 200) {
        const message = `An error has occurred: ${response.status} - ${response.statusText}`;
        setError(message);
        return;
      }

      const data = response.data;

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token); // Save token in local storage
        alert("Login successful!");
        navigate("/productList"); // Redirect to the main page
      } else {
        setError(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-label">Log in</div>
      <br />
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
