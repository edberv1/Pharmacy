import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";


function SuperAdmin() {
  return (
    <>
      <div className="flex">
        <div className="flex-none">
          <Sidebar />
        </div>
        <div className="flex-1 mt-0">
           {/* Use Outlet to render the content of nested routes */}
            <Header />
           <Outlet />
        </div>
      </div>
    </>
  );
}

export default SuperAdmin;