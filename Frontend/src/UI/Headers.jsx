import React, { useState } from 'react'
// import { NavLink } from 'react-router-dom'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthService from './../Services/AuthService';
import { GiHamburgerMenu } from "react-icons/gi";

function Headers() {
  const[show,setShow] = useState(false)

  const handleButtonToggle = ()=>{
  return setShow(!show);
  }

  const navigate = useNavigate();

  const logOutUser = async ()=>{
    await AuthService.logoutUser();
    navigate('/login', {replace:true});
  }

  return (
    <header>
      <div className='container'>
        <div className='grid navbar-grid'>
          <div className='Logo'>
            <NavLink to='/'>
              <h1>WorldAtlas</h1>
            </NavLink>
          </div>
          <nav className={show ? "menu-mobile" : "menu-web"}>
            <ul>
              <li><NavLink to="/layout/home" onClick={() => setShow(false)} >Home</NavLink></li>
              <li><NavLink to="/layout/about" onClick={() => setShow(false)} >About</NavLink></li>
              <li><NavLink to="/layout/contact" onClick={() => setShow(false)} >Contact</NavLink></li>
              <li><NavLink to="/layout/country" onClick={() => setShow(false)} >Country</NavLink></li>
              <li>
                  <Link 
                  onClick={() => {
                    logOutUser();
                    setShow(false);
                  }}
                    className="text-gray-500 hover:text-gray-700">Logout
                  </Link>
                </li>

            </ul>
          </nav>

          <div className='ham-menu'>
            <button onClick={handleButtonToggle} >
            <GiHamburgerMenu />
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Headers