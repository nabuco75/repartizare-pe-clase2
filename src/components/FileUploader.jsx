import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext"; // Importul useAuth din Context API
import "./FileUploader.css";

function FileUploader({ onFileUpload }) {
  const { state } = useAuth(); // Utilizarea useAuth pentru a accesa starea autentificării

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="FileUploader">
      {state.isAuthenticated ? ( // Verifică dacă utilizatorul este autentificat
        <label className="FileUploader-label">
          Încarcă fișierul
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
        </label>
      ) : (
        <p>Logați-vă pentru a încărca fișiere.</p> // Mesaj pentru utilizatorii neautentificați
      )}
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
