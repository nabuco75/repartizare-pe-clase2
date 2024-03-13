import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import * as XLSX from "xlsx";
import "./FileUploader.css";

function FileUploader({ onFileUpload }) {
  const { state } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Convertim formatul datelor în formatul așteptat de RepartizareElevi
          const formattedData = jsonData.map((item) => {
            const { NUME, PRENUME, GENUL } = item;
            return { nume: `${NUME} ${PRENUME}`, gen: GENUL };
          });

          console.log(formattedData); // Verifică datele formatate aici
          onFileUpload(formattedData);
        } catch (error) {
          console.error("Error reading the Excel file: ", error);
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
            Încarcă fișierul
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
          </label>
          <div className="download-template-container">
            <a href={`${process.env.PUBLIC_URL}DownloadTemplate.xlsx`} download="DownloadTemplate.xlsx" className="download-template-link">
              Descarcă Macheta
            </a>
          </div>
        </>
      ) : (
        <p className="paragraph-file-uploder">
          Vă invităm să vă autentificați pentru a accesa macheta necesară repartizării elevilor. Nu aveți cont? Creați unul acum pentru a vă alătura comunității noastre și a accesa resursele necesare
          repartizării elevilor în formațiunile de studiu aprobate.
        </p>
      )}
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
