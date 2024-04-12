import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initializeState = () => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return email && role ? { email, role } : { email: null, role: null };
  };

  const [user, setUser] = useState(initializeState);

  // ...

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider;
