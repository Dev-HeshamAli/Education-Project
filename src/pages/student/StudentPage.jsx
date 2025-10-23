import React from 'react'
import Navbar from '../../components/student/Navbar'
import { Outlet } from 'react-router-dom'
import { Footer } from '../../components/student/Footer'

const StudentPage = () => {
  return (
    <div>
      <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
     <Footer />
    </div>
  )
}

export default StudentPage