import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types"; // Importă PropTypes

// Crearea contextului pentru autentificare
const AuthContext = createContext();

// Starea inițială a autentificării
const initialAuthState = {
  isAuthenticated: false,
};

// Reducer pentru gestionarea stării autentificării
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, isAuthenticated: false };
    case "RESET_PASSWORD":
      // Adaugă logică pentru resetarea parolei aici
      return state;
    default:
      return state;
  }
};

// Provider-ul contextului pentru autentificare
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

// Validează tipul prop-ului "children"
AuthProvider.propTypes = {
  children: PropTypes.node,
};

// Hook personalizat pentru a accesa contextul de autentificare
export const useAuth = () => {
  return useContext(AuthContext);
};
