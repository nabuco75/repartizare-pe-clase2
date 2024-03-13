import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Unifică importurile pentru Firebase Auth
import "./Navbar.css";

const Navbar = () => {
  const { state, dispatch } = useAuth(); // Dacă folosești dispatch pentru a actualiza starea contextului
  const { isAuthenticated } = state || {};
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails({
          name: user.displayName || "Utilizator", // Asigură-te că ai o valoare fallback
        });
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      dispatch({ type: "LOGOUT" }); // Actualizează contextul de autentificare, dacă este cazul
    } catch (error) {
      console.error("Eroare la delogare: ", error);
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <div className="user-info">
            <p>Hello, {userDetails?.name}</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </>
      ) : (
        <div>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
