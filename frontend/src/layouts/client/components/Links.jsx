import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Links() {
  const [hide, setHide] = useState(false);

  const checkScroll = () => {
    if (window.pageYOffset > 50) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className={`fixed top-16 w-full h-10 z-40 bg-gray-900 text-white transition-all duration-500 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex justify-center items-center h-full space-x-8">

        <Link
          to="/pharmacies"
          className="text-l text-blue dark:text-white-500 hover:underline"
        >
          <i className="fa-solid fa-hospital pr-2"></i>
          Pharmacies
        </Link>

        <Link
          to="/aboutUs"
          className="text-l text-blue dark:text-white-500 hover:underline"
        >
          <i className="fa-solid fa-regular fa-circle-info pr-2"></i>
          About Us
        </Link>
    
        <Link
          to="/mbrojtje"
          className="text-l text-blue dark:text-white-500 hover:underline"
        >
          Mbrojtje
        </Link>

      </div>
    </div>
  );
}

export default Links;
