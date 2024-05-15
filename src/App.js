import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Importă componenta Navbar
import Landing from "./components/Landing";
import Login from "./Auth/Login";
import RegistrationForm from "./Auth/Registration";
import { AuthProvider } from "./components/AuthContext"; // Importă AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
