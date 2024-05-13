import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Make sure to import your Footer component

function Client() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar />
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Client;
