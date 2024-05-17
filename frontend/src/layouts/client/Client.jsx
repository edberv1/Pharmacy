import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Make sure to import your Footer component
import Cart from "./components/Cart";

function Client() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar openCart={() => setIsCartOpen(true)}/>
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
      {isCartOpen && <Cart closeCart={() => setIsCartOpen(false)} />}
    </div>
  );
}

export default Client;

