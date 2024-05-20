import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import RegistrationForm from "../Auth/Registration";
import Login from "../Auth/Login";
import ParentComponent from "./ParentComponent";
import Header from "./Header";
import "./Landing.css";

const Landing = () => {
  const { state } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="landing-container">
      <Header backgroundImage="/assets/Repartizare3.webp" />
      <main className="landing-main">
        {!state.isAuthenticated ? (
          <div className="auth-message">
            <p>
              Vă invităm să vă autentificați pentru a accesa macheta necesară repartizării elevilor. Nu aveți cont? Creați unul acum pentru a vă alătura comunității noastre și a accesa resursele
              necesare repartizării elevilor în formațiunile de studiu aprobate.
            </p>
            {showLogin ? (
              <>
                <Login onLogin={() => setShowLogin(false)} />
                <p>
                  Nu ai cont? <button onClick={toggleForm}>Înregistrează-te</button>
                </p>
              </>
            ) : (
              <>
                <RegistrationForm onLogin={() => setShowLogin(true)} />
                <p>
                  Ai deja cont? <button onClick={toggleForm}>Loghează-te</button>
                </p>
              </>
            )}
          </div>
        ) : (
          <ParentComponent />
        )}
      </main>
    </div>
  );
};

export default Landing;
