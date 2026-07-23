import React, { useContext, useState } from 'react'
import { Context } from '../main';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://docbooker-backend-2hzo.onrender.com/api/v1/user/login",
        { email, password , role: "Patient" },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
      
    }
    catch (e) {
      toast.error(e.response.data.message);
    }
  };
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <div className='container form-component login-form'>
      <h2>Sign In</h2>
      <p>Please Login To Continue</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        
         <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
  />

  <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
       
        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row"
          }}
        >
          <p style={{ marginBottom: 0 }}>Not Registered?</p>
          <Link
            to={"/register"}
            style={{ textDecoration: "none", alignItems: "center" }}
          >
            Register Now
          </Link>
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  )
};

export default Login;
