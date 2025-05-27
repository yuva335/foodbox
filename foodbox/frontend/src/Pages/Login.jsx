import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Signup.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleLogin = async () => {
    console.log('Login submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    
    if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      localStorage.setItem('role', data.user.role);
      alert("Login successful!");
      navigate('/home'); 
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred during login.");
  }
  };

  return (
    <div className="page-content">
      <div className='signup'>
        <div className="signup-container" style={{ flex: 1 }}>
          <h1>Login</h1>
          <div className="signup-fields">
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <button onClick={handleLogin}>Continue</button>
          <p className='signup-login'>Don't have an account?<span onClick={handleSignupRedirect}> Sign up here</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
