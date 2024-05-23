import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import * as XLSX from "xlsx";
import "./FileUploader.css";

function FileUploader({ onFileUpload }) {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e, category) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const formattedData = jsonData.map((item) => ({
            nume: item.NUME,
            prenume1: item["PRENUME 1"],
            prenume2: item["PRENUME 2"],
            gen: item.GENUL,
            rudeGrad1: item["RUDE GRAD 1"] === "DA",
          }));

          onFileUpload(formattedData, category);
        } catch (error) {
          console.error("Error reading the Excel file:", error);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="FileUploader">
      {state.isAuthenticated ? (
        <>
          <div className="download-buttons-container">
            <a href={`${process.env.PUBLIC_URL}/assets/macheta de incarcare-LISTA1-blank.xlsx`} download="macheta de incarcare-LISTA1-blank.xlsx" className="download-button">
              Descarcă Lista 1
            </a>
            <a href={`${process.env.PUBLIC_URL}/assets/macheta de incarcare-LISTA2-blank.xlsx`} download="macheta de incarcare-LISTA2-blank.xlsx" className="download-button">
              Descarcă Lista 2
            </a>
          </div>

          <label className="FileUploader-label">
            Încarcă fișierul pentru elevii care împlinesc 6 ani înainte de 31 august
            <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "before")} />
          </label>
          <label className="FileUploader-label">
            Încarcă fișierul pentru elevii care împlinesc 6 ani după 31 august
            <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "after")} />
          </label>
          {isLoading && <p>Se încarcă...</p>}
        </>
      ) : (
        <p className="paragraph-file-uploder">Vă invităm să vă autentificați pentru a accesa funcționalitățile.</p>
      )}
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
