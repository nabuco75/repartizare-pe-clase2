import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegistrationForm from "./Auth/Registration";
import Login from "./Auth/Login";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <header className="App-header"></header>
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
