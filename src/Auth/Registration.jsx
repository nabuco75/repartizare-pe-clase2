import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from "../firebase-config"; // Ajustează calea de import după necesitate
import "./Registration.css";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, firstName, lastName } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      await sendEmailVerification(user);

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="email" className="registration-label">
            Email
          </label>
          <input type="email" id="email" name="email" className="registration-input" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="registration-label">
            Password
          </label>
          <input type="password" id="password" name="password" className="registration-input" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>
        <div className="form-group">
          <label htmlFor="firstName" className="registration-label">
            First Name
          </label>
          <input type="text" id="firstName" name="firstName" className="registration-input" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="registration-label">
            Last Name
          </label>
          <input type="text" id="lastName" name="lastName" className="registration-input" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
        </div>
        <button type="submit" className="register-button">
          Sign Up
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default RegistrationForm;
