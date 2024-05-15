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
            nume: `${item.NUME} ${item.PRENUME}`,
            gen: item.GENUL,
            dataNasterii: item.DATA_NASTERII,
            frati: item.FRATI,
          }));

          console.log("Parsed data:", formattedData);
          console.log("Category:", category);

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
          <label className="FileUploader-label">
            Încarcă fișierul pentru elevii care împlinesc 6 ani înainte de 1 septembrie
            <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "before")} />
          </label>
          <label className="FileUploader-label">
            Încarcă fișierul pentru elevii care împlinesc 6 ani după 1 septembrie
            <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "after")} />
          </label>
          {isLoading && <p>Se încarcă...</p>}
          <div className="download-template-container">
            <a href={`${process.env.PUBLIC_URL}/DownloadTemplate.xlsx`} download="DownloadTemplate.xlsx" className="download-template-link">
              Descarcă Macheta
            </a>
          </div>
        </>
      ) : (
        <p>Vă invităm să vă autentificați pentru a accesa funcționalitățile.</p>
      )}
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
