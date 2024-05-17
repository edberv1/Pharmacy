import React, { useEffect } from 'react';
import { AlertContext } from '../../../contexts/AlertContext'; // import AlertContext

const Alert = () => {
  const { message, type, isVisible, hideAlert } = React.useContext(AlertContext); // use AlertContext
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideAlert]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className={`flex w-full max-w-sm overflow-hidden rounded-lg shadow-md ${colors[type]}`}>
      <div className="px-4 py-2 -mx-3">
        <div className="mx-3">
          <span className="font-semibold text-white">{type}</span>
          <p className="text-sm text-white">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
