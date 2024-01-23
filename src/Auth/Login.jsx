import React, { useState } from "react";
import { auth } from "../firebase-config"; // Update the import path
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Import signInWithEmailAndPassword and other necessary Firebase functions
import { useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setFormData({
        email: "",
        password: "",
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError("Error sending reset email. Please, enter valid email!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login__container">
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="login__input" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="login__input" />
      {error && <p className="error-message">{error}</p>}
      {resetMessage && <p className="success-message">{resetMessage}</p>}
      <button type="submit" className="login__button" disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>
      <button type="button" className="forgot-button" onClick={handleForgotPassword}>
        Reset password
      </button>
    </form>
  );
};

export default Login;
