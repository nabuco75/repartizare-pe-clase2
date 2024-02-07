import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from "../firebase-config"; // Adjust the import path as necessary
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, firstName, lastName } = formData;

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Send email verification
      await sendEmailVerification(user);

      // Redirect the user to the login page
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input type="email" name="email" className="registration-input" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" className="registration-input" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="text" name="firstName" className="registration-input" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="lastName" className="registration-input" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
        <button type="submit" className="registerButton">
          Sign Up
        </button>
        {/* If you have a reset button, add it here with the "reset-button" class */}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default RegistrationForm;
