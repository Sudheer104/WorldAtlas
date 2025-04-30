import React, { useState } from 'react'
import { Link } from "react-router-dom";
import AuthService from "../../Services/AuthService";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append('email', email);

        try {
            const response = await AuthService.forgetPassword(formData);
            const data = response.data;
            console.log(data);
            alert(data.msg);
            if (data.success) {
                setEmail("")
            }
        } catch (error) {
            console.log(error);
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                if (error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    const newErrors = {};
                    apiErrors.forEach(apiError => {
                        newErrors[apiError.path] = apiError.msg;
                    });
                    setErrors(newErrors)
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
                <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>Forget Password</h1>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="email" style={{ display: 'block', color: '#4a5568', fontSize: '24px', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                        Your Email
                    </label>
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

                <button
                    type="submit"
                    style={{ backgroundColor: '#3182ce', color: 'white', padding: '1rem', borderRadius: '4px', fontWeight: 'bold', width: '100%', cursor: 'pointer', border: 'none', fontSize: '20px' }}
                >
                    Submit
                </button>

                <p style={{ color: '#2b6cb0', marginTop: '1.5rem', fontSize: '20px' }}>
                    <Link to="/login" style={{ color: '#d53f8c', fontSize: '20px' }}> Login </Link>
                </p>
            </form>
        </div>
    )
}

export default ForgetPassword;
