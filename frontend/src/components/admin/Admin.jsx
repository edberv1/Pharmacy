import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
// import Products from "./pages/Products"

function Admin() {
  return (
    <>
      <div className="flex">
        <div className="flex-none">
          <Sidebar />
        </div>
        <div className="flex-1 mt-6">
           {/* Use Outlet to render the content of nested routes */}
           <Outlet />
        </div>
      </div>
    </>
  )
}

export default Admin
