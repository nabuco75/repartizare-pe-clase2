import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS you just created

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default Navbar;
