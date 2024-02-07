// authReducer.js
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, isAuthenticated: false };
    // Alte cazuri
    default:
      return state;
  }
};

// Starea inițială a autentificării
const initialAuthState = {
  isAuthenticated: false,
};

export default authReducer;
