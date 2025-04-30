import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../../Services/AuthService';

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('password', password);
    formData.append('image', image);

    try {
      const response = await AuthService.register(formData);
      const data = response.data;
      alert(data.msg);
      if (data.success) {
        navigate('/login', { replace: true });
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafc', padding: '0 1rem' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Enter Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none' }}
          />
          {errors.name && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="image" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Select image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none', cursor: 'pointer' }}
          />
          {errors.image && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.image}</div>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none' }}
          />
          {errors.email && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="mobile" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>Enter Mobile No.</label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '20px', color: '#4a5568', outline: 'none' }}
          />
          {errors.mobile && <div style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '20px' }}>{errors.mobile}</div>}
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
          Register
        </button>

        <p style={{ color: '#2b6cb0', marginTop: '1.5rem', fontSize: '20px' }}>
          You have an account
          <Link to="/login" style={{ color: '#d53f8c', fontSize: '20px' }}> Login </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

