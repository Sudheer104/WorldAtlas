import React from 'react'
import Headers from '../../UI/Headers'
import Footer from '../../UI/Footer'
import { Outlet } from 'react-router-dom'

function AppLayout() {
    return (
        <>
            <Headers/> {/* HEADER Ye change nahi hoga* */}
            <Outlet />  {/* AppLayout Child Object, Ye change  hoga* */}
            <Footer /> {/* FOOTER Ye change nahi hoga* */}
        </>
    )
}

export default AppLayout