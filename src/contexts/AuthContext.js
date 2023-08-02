
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [contextjwt, setContextjwt] = useState("");

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, role, setRole ,contextjwt, setContextjwt}}>
      {children}
    </AuthContext.Provider>
  );
};
