import { useContext, useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContexts";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    if (window.confirm("Confirm Logout?")) {
      setUser({ email: null, posts: [] });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      navigate("/");
    }
  };

  // Add this useEffect hook
  useEffect(() => {
    // This function will run whenever the user state changes
  }, [user]);

  return (
    <>
    {/* <nav className="bg-white border-gray-200 text-black dark:bg-gray-900"> */} 
      <nav className="border-gray-200 bg-gray-900 text-white">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Pharmacy
            </span>
          </Link>
          {user.email ? (
            
            <div className="flex items-center space-x-6 rtl:space-x-reverse">

              <Link to="/pharmacies" className="text-md text-white dark:text-white-500 hover:underline">
                <i className="fa-solid fa-hospital pr-2"></i>
                Pharmacies
              </Link>
              <Link to="/aboutUs" className="text-md text-white dark:text-white-500 hover:underline">
                <i className="fa-solid fa-regular fa-circle-info pr-2"></i>
                About Us
              </Link>
              
              <Link to="/profile" className="text-md text-white dark:text-white-500 hover:underline">
                <i className="fa-solid fa-user pr-2"></i>
                Profile
              </Link>
              <Link to="/login" onClick={handleLogout} className="text-md pl-2 text-white dark:text-white-500 hover:underline">
                <i className="fa-solid text-white fa-right-to-bracket pr-2"></i>
                Logout
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <Link
              to="/signup"
              className="text-md  text-white dark:text-white-500 hover:underline"
            >
              <i className="fa-solid fa-user pr-2"></i>
              Sign Up
            </Link>
            <span>
              <Link
                to="/login"
                className="text-md pl-2 text-white dark:text-white-500 hover:underline "
              >
                <i className="fa-solid text-white fa-right-to-bracket pr-2"></i>
                Login
              </Link>
            </span>
          </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
