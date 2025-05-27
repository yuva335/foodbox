import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './CSS/Signup.css'
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignup = async () => {
    console.log('Signup data submitted');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);

    if (!name || !email || !password || !role) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role, 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); 
            console.log("User object from signup response:", data.user);
            localStorage.setItem('role', data.user.role);
            console.log("Stored role:", data.user.role);
            alert("Signup successful!");
            navigate('/home'); 
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    }
};


  return (
    <div className="page-content">
    <div className='signup'>
      <div className="signup-container" style={{ flex: 1 }}>
        <h1>Sign Up</h1>
        <div className="signup-fields">
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' required />
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="role-dropdown" required>
            <option value="">Select Role</option>
            <option value="individual">Individual</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery Store</option>
            <option value="organization">Organization</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <button onClick={handleSignup}>Continue</button>
        <p className='signup-login'>Already have an account?<span onClick={handleLoginRedirect}> Login here</span></p>
        <div className="signup-agree">
          <input type='checkbox' name='' id='' />
          <p>By continuing, I agree to the terms of use and privacy policy</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup