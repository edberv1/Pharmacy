import React, { useState, useRef } from 'react';

export const AlertContext = React.createContext();

export const AlertProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const timeoutId = useRef(null); // Use useRef here

  const showAlert = (message, type) => {
    setMessage(message);
    setType(type);
    setIsVisible(true);

    // Clear the previous timeout if it exists
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Hide the alert after 5 seconds
    timeoutId.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  return (
    <AlertContext.Provider value={{ message, type, isVisible, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
