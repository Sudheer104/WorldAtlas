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

    //Create a formData to send in backend
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);


    try {
      const response = await AuthService.login({ email, password });
      const data = response.data;
      if (data.success) {
        // console.log(data);
        AuthService.loginUser(data);
        setIsLoggedIn(true);
      } else {
        alert(errors.msg);
      }
  } catch (error) {
    // console.log(error);
    // alert("There was an error registering! "+error.message)
    if (error.response && (error.response.status === 400 || error.response.status === 401)) {
      if (error.response.data.errors) {

        const apiErrors = error.response.data.errors;
        const newErrors = {};
        apiErrors.forEach((apiError) => {
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

  useEffect(()=>{
    if(isLoggedIn){
      navigate('/layout/home',{replace:true});
    }
  },[isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Your email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.email && <div className="text-red-700 font-bold ">{errors.email}</div>}


        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.password && <div className="text-red-700 font-bold ">{errors.password}</div>}


        </div>
        {/* <div className="mb-4 flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="mr-2 leading-tight"
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Remember me
          </label>
        </div> */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          Submit
        </button>
        <p className="text-blue-800 mt-2 " >
          Don't have an account 
          <Link className="text-pink-800" to="/register"> Register </Link><br />
          <Link className="text-pink-800" to="/forget-password"> Forget Password </Link> 
           </p>
      </form>
    </div>
  );
};

export default Login;



