import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function Admin() {
  return (
    <>
    <div className="flex">
        <div className="flex-none fixed">
          <Sidebar />
        </div>
        <div className="flex-1 pl-56 w-1/2">
           {/* Use Outlet to render the content of nested routes */}
           
            <Header />
           <Outlet />
        </div>
      </div>
    </>
  );
}

export default Admin;
