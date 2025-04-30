import React from 'react'
import './App.css'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from './components/Login/Login'
import Register from './components/Register/Register'

// import Layout from './components/Layouts/Layout'
import AuthService from './Services/AuthService';
import UpdateProfile from './Pages/UpdateProfile';
import ForgetPassword from './components/Forget Password/ForgetPassword';
import Country from './Pages/Country';
import { CountryDetails } from './components/Layouts/CountryDetails';
import AppLayout from './components/Layouts/AppLayout';



const UnprotectedRoute = ({ element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  return isAuthenticated ? <Navigate to="/layout/home" replace /> : element;
};

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  return isAuthenticated ? element : <Navigate to="/login" />;
};


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <UnprotectedRoute element={<Login />} />,
    },
    {
      path: "/register",
      element: <UnprotectedRoute element={<Register />} />,
    },
    {
      path: "/forget-password",
      element: <UnprotectedRoute element={<ForgetPassword/>} />,
    },
    {
      path: '/layout',
      element: <ProtectedRoute element={<AppLayout/>} />,
      children: [
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'about',
          element: <About />
        },
        {
          path: 'contact',
          element: <Contact />
        },
        {
          path: 'updateProfile',
          element: <UpdateProfile/>
        },
        {
          path: 'country',
          element: <Country/>
        },
        {
          path: 'country/:id',
          element: <CountryDetails/>
        }
      ]
    },

  ]);

  return (
    // <>
    //   <Router>
    //     <Routes>
    // <Route path='/' element={<Navigate to="/login" />} />
    // <Route path='/login' element={<Login />} /> {/*Or used in place of element-> component={Login} */}
    // <Route path='/register' element={<Register />} />
    //       {/* Protected Routes under Layout */}
    //       <Route path='/' element={<Layout />}></Route>

    //     </Routes>
    //   </Router>
    // </>



<RouterProvider router={router} />

  )
}

export default App
