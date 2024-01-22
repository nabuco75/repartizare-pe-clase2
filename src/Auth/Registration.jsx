// src/pages/RegistrationPage.js
import React, { useState } from "react";
import { auth } from "../firebase-config";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      // Redirect or update UI after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={register}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationPage;
