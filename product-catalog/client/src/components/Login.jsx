import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
    
          if (!response.ok) {
            const message = `An error has occurred: ${response.status} - ${response.statusText}`;
            alert(message);
            return;
          }
    
          const data = await response.json();
          console.log(data);
    
          if (data.success) {
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token); // Save token in local storage
            alert('Login successful!');
            navigate('/productList'); // Redirect to the main page
          } else {
            alert(`Login failed: ${data.message}`);
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          alert('An error occurred during login. Please try again.');
        }
      };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
