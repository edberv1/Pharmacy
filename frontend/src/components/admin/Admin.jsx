import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; // Import Header component

function Admin() {
  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex flex-col flex-grow pl-[sidebarWidth] overflow-auto">
        <Header />
        <main className="flex-grow overflow-x-hidden overflow-y-auto bg-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
