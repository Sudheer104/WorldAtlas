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
      // console.log(data);
      alert(data.msg);
      if (data.success) {
        navigate('/login', { replace: true });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit}
       className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Enter Name
          </label>
          <input
            type="text"
            id="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <div className="text-red-700 font-bold ">{errors.name}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Select image
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    {errors.image && <div className="text-red-700 font-bold ">{errors.image}</div>}

        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    {errors.email && <div className="text-red-700 font-bold ">{errors.email}</div>}

        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-gray-700 text-sm font-bold mb-2">
            Enter Mobile No.
          </label>
          <input
            type="tel"
            id="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    {errors.mobile && <div className="text-red-700 font-bold ">{errors.mobile}</div>}

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
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    {errors.password && <div className="text-red-700 font-bold ">{errors.password}</div>}

        </div>

        <div className="mb-4 flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="mr-2 leading-tight"
          // required
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          Register
        </button>
        <p className="text-blue-800 mt-2" >You have an account <Link className="text-pink-800" to="/login"> Login </Link> </p>
      </form>
    </div>
  );
}

export default Register;


