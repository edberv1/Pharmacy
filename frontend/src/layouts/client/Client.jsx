import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Links from '../client/components/Links';

function Client() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar/>
      <Links/>
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Client;

