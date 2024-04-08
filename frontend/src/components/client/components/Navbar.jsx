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
            <a
              href=""
              className="text-sm  text-gray-500 dark:text-white hover:underline"
            >
              Sign Up
            </a>
            <a
              href="#"
              className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
