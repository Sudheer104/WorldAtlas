import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../Services/AuthService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    // Create a formData to send in backend
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await AuthService.login({ email, password });
      const data = response.data;
      if (data.success) {
        AuthService.loginUser(data);
        setIsLoggedIn(true);
      } else {
        alert(errors.msg);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        if (error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          const newErrors = {};
          apiErrors.forEach((apiError) => {
            newErrors[apiError.path] = apiError.msg;
          });
          setErrors(newErrors);
        } else {
          alert(error.response.data.msg ? error.response.data.msg : error.message);
        }
      } else {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/layout/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafc', padding: '0 1rem' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Your email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none' }}
          />
          {errors.email && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Your password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none' }}
          />
          {errors.password && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.password}</div>}
        </div>

        <button
          type="submit"
          style={{ backgroundColor: '#3182ce', color: 'white', padding: '1rem', borderRadius: '4px', fontWeight: 'bold', width: '100%', cursor: 'pointer', border: 'none', fontSize: '20px' }}
        >
          Submit
        </button>

        <p style={{ color: '#2b6cb0', marginTop: '1.5rem', fontSize: '20px' }}>
          Don't have an account
          <Link to="/register" style={{ color: '#d53f8c', fontSize: '20px' }}> Register </Link><br />
          <Link to="/forget-password" style={{ color: '#d53f8c', fontSize: '20px' }}> Forget Password </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
