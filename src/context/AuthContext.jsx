import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Safely read user — both token AND valid user object must exist
const readUser = () => {
  try {
    const token = sessionStorage.getItem("token");
    const saved = sessionStorage.getItem("user");
    if (!token || !saved || saved === "undefined" || saved === "null")
      return null;
    const parsed = JSON.parse(saved);
    // Support both _id (MongoDB) and id
    if ((!parsed?._id && !parsed?.id) || !parsed?.role) return null;
    // Normalize — always use _id
    if (!parsed._id && parsed.id) parsed._id = parsed.id;
    return parsed;
  } catch {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readUser);

  const login = (userData, token) => {
    // Normalize _id — some backends send 'id' instead of '_id'
    if (!userData._id && userData.id) userData._id = userData.id;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const getToken = () => sessionStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
