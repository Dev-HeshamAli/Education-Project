import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <nav>Dashboard Navbar / Sidebar</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
