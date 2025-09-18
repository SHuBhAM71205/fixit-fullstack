import { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Export a hook for easy access
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('loggedIn') === 'true'
  );

  const login = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
  };

  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
