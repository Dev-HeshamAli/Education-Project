import React from 'react'
import Navbar from '../../components/student/Navbar'
import { Outlet } from 'react-router-dom'
import { Footer } from '../../components/student/Footer'

const StudentPage = () => {
  return (
    <div>
       <Navbar />
      <Outlet />
      <Footer/>
    </div>
  )
}

export default StudentPage