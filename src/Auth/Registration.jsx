import React, { useState } from "react";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import "./Registration.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateField = (name, value) => {
    let error = "";
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (name === "email" && !emailPattern.test(value)) {
      error = "Invalid email format";
    } else if (name === "password" && !passwordPattern.test(value)) {
      error = "Password must be at least 8 characters and include both letters and numbers.";
    } else if ((name === "firstName" || name === "lastName") && !value.trim()) {
      error = `${name.replace("Name", " Name")} is required`;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all form fields before submission
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value);
    });

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update the user's profile with their displayName
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      await sendEmailVerification(user);
      setSuccessMessage("Your account was successfully created! Please verify your email before logging in.");

      // Additional code to handle the registration success...
    } catch (error) {
      console.error("Error registering user:", error.message);
      // Handle registration errors
      // Set an error message for the user to see, if needed
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
    setErrors({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
    setSuccessMessage("");
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" required className="registration-input" />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="Password" required className="registration-input" />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="First Name" required className="registration-input" />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Last Name" required className="registration-input" />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <button type="submit" className="registerButton">
          Sign Up
        </button>

        <button type="button" className="reset-button" onClick={handleReset}>
          Reset
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default RegistrationForm;
