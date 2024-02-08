import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const Login = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { email, password } = formData;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({ type: "LOGIN", payload: user }); // Salvăm informațiile despre utilizator în context

      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login__container">
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="login__input" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="login__input" />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="login__button" disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
