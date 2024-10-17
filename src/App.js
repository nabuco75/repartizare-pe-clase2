import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./Auth/Login";
import RegistrationForm from "./Auth/Registration";
import { AuthProvider } from "./components/AuthContext";
import NotFound from "./components/NotFound"; // Exemplu de pagină 404

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="*" element={<NotFound />} /> {/* Ruta pentru pagini inexistente */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
