import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a
            href="#"
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
          </a>
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;
