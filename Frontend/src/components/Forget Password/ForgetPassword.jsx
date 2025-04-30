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
            // alert("There was an error registering! "+error.message)
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
        <div>
            <form onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
                <h1 className='text-2xl font-bold text-black'>Forget Password</h1>

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

                <button
                    type="submit"
                    className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                >
                    Submit
                </button>
                <p className="text-blue-800 mt-2" >
                    <Link className="text-pink-800" to="/login"> Login </Link>
                </p>
            </form>
        </div>
    )
}

export default ForgetPassword

