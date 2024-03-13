import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegistrationForm from "./Auth/Registration";
import Login from "./Auth/Login";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header"; // Importă componenta Header

// Importă imaginea pe care dorești să o afișezi
import backgroundImage from "./assets/Repartizare1.webp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="navbar">
          <Navbar />
        </div>
        {/* Utilizează componenta Header și transmite-i prop-ul backgroundImage */}
        <Header backgroundImage={backgroundImage} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
