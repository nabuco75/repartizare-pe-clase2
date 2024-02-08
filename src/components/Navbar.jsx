import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importăm metoda onAuthStateChanged pentru a asculta schimbările de stare ale autentificării
import "./Navbar.css";

const Navbar = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state || {};
  const [userDetails, setUserDetails] = useState(null); // Starea pentru a stoca detaliile utilizatorului

  useEffect(() => {
    const auth = getAuth();

    // Ascultăm schimbările de stare ale autentificării pentru a obține detalii despre utilizator
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Dacă utilizatorul este autentificat, obținem detaliile și le actualizăm în starea locală
        setUserDetails({
          name: user.displayName,
          // puteți adăuga și alte detalii aici, dacă sunt disponibile în profilul utilizatorului
        });
      } else {
        // Dacă utilizatorul nu este autentificat, ștergem detaliile din starea locală
        setUserDetails(null);
      }
    });

    // Curățăm eventualele abonări la schimbările de stare ale autentificării
    return () => unsubscribe();
  }, []);

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <div className="user-info">
          <p>Hello, {userDetails?.name}</p> {/* Afisăm numele utilizatorului */}
        </div>
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
