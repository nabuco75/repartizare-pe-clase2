import React from "react";
import PropTypes from "prop-types"; // Importă PropTypes
import "./FileUploader.css";

function FileUploader({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="FileUploader">
      <label className="FileUploader-label">
        Încarcă fișierul
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
      </label>
    </div>
  );
}

// Validează tipul prop-ului "onFileUpload"
FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
