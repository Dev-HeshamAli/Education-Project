import { Outlet } from "react-router-dom";
import { Footer } from "../../components/parent/Footer";
import Navbar from "../../components/parent/Navbar";
import Loader from "../../components/landingPage/Loader";

const ParentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Loader />
      <Footer />
    </div>
  );
};

export default ParentPage;
