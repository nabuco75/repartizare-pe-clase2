import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const Login = ({ onLogin }) => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({ email: "", password: "" });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  }, []);

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "email") {
      if (!value) {
        errorMessage = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMessage = "Invalid email address.";
      }
    } else if (name === "password") {
      if (!value) {
        errorMessage = "Password is required.";
      }
    }
    setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formIsValid = Object.values(inputErrors).every((error) => error === "");
    if (!formIsValid) return;

    setError(null);
    setLoading(true);

    const { email, password } = formData;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({ type: "LOGIN", payload: user });

      setLoading(false);
      onLogin(); // Asigură-te că apelăm onLogin
      navigate("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="login__container">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="login__input" />
        {inputErrors.email && <p className="error-message">{inputErrors.email}</p>}
      </div>

      <div className="form-group" style={{ position: "relative" }}>
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          className="login__input"
        />
        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
          {showPassword ? "Hide" : "Show"}
        </button>
        {inputErrors.password && <p className="error-message">{inputErrors.password}</p>}
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="login__button" disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>
    </form>
  );
};

// Adăugăm validarea prop-urilor
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
