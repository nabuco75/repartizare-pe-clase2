// authReducer.js
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // Atunci când utilizatorul se autentifică cu succes, actualizați starea autentificării
      // pentru a include informațiile despre utilizatorul autentificat
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // Salvați informațiile despre utilizator din acțiunea LOGIN
      };
    case "LOGOUT":
      // Atunci când utilizatorul se deconectează, resetați starea autentificării
      return { ...state, isAuthenticated: false, user: null }; // Resetați și informațiile despre utilizator
    // Alte cazuri
    default:
      return state;
  }
};

// Starea inițială a autentificării
const initialAuthState = {
  isAuthenticated: false,
  user: null, // Inițializați utilizatorul ca fiind null în starea autentificării
};

export default authReducer;
