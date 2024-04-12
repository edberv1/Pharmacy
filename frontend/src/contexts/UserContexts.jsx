import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    role: null,
  });

  // Add this useEffect hook
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (email && role) {
      setUser({ email, role });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
