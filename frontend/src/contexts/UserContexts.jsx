/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initializeState = () => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");

    return email && role && id ? { email, role, id } : { email: null, role: null, id: null };
  };

  const [user, setUser] = useState(initializeState);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;


