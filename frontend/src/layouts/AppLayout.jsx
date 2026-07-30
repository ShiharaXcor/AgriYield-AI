import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-bg-dark">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;