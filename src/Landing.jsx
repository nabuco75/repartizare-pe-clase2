import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Import your CSS file for styling

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to Our App</h1>
      <p>This is the home page of your application.</p>
      <div className="action-buttons">
        <Link to="/register" className="register-button">
          Register
        </Link>{" "}
        |
        <Link to="/login" className="login-button">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
