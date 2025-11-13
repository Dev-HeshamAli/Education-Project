import React from "react";
import Navbar from "../../components/student/Navbar";
import { Outlet } from "react-router-dom";
import { Footer } from "../../components/student/Footer";
import Loader from "../../components/landingPage/Loader";
const StudentPage = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Loader />
      <Footer />
    </div>
  );
};

export default StudentPage;
