import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegistrationForm from "./Auth/Registration";
import Login from "./Auth/Login";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="header"> Clasa Pregătitoare: Repartizarea elevilor pe clase - Aplicație Web - proiect digital al Școlii Gimnaziale Ștefan cel Mare Vaslui</div>
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
