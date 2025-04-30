import React, { useEffect, useRef, useState } from 'react'
import AuthService from './../Services/AuthService';

function UpdateProfile() {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({})

    const fileInputRef = useRef();

    const refreshData = () => {
        const userData = AuthService.getUserData();

        setName(userData.name)
        setEmail(userData.email)
        setMobile(userData.mobile)
        setImage(null)
        setImageUrl(import.meta.env.VITE_API_BE_URL + "" + userData.image)
        
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
        
    }

    useEffect(() => {
        refreshData();
    }, []);




    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobile', mobile);
        if (image) {
            formData.append('image', image);
        }


        try {
            const response = await AuthService.updateUserData(formData);
            const data = response.data;
            if (data.success) {
                alert(data.msg)
                AuthService.setUserData(data.user);
                refreshData();
            } else {
                alert(data.msg)
            }
        } catch (error) {
            // console.log(error);
            // alert("There was an error registering! "+error.message)
            if (error.response && (error.response.status === 400 || error.response.status === 400)) {
              if (error.response.data.errors) {
      
                const apiErrors = error.response.data.errors;
                const newErrors = {};
                apiErrors.forEach(apiError => {
                  newErrors[apiError.path] = apiError.msg;
                });
      
                setErrors(newErrors)
      
              } else {
                alert(error.response.data.msg ? error.response.data.errors.msg : error.message);
              }
            } else {
              alert("This session has expired please try again" || error.message);
            }
          }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div>
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" />
                    
                ) : (
                    <p>No image available</p> // You can show a default placeholder or a message when no image is available.
                )}
                
            </div>


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
                        ref={fileInputRef}
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
                        disabled
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@gmail.com"
                        // required
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-300 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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


                <button
                    type="submit"
                    className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                >
                    Update Profile
                </button>
            </form>
        </div>
    )
}

export default UpdateProfile