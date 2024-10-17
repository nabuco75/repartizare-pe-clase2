import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import * as XLSX from "xlsx";
import "./FileUploader.css";

function FileUploader({ onFileUpload }) {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    lista1_fete: false,
    lista2_fete: false,
    lista1_baieti: false,
    lista2_baieti: false,
  });
  const [warnings, setWarnings] = useState("");
  const [fileNames, setFileNames] = useState({});
  const [totalEleviIncarcati, setTotalEleviIncarcati] = useState(0); // Adăugat pentru a contoriza elevii

  const handleFileChange = (e, category) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Încărcăm fișierul:", file.name);
      const expectedNames = {
        lista1_fete: "Lista 1 Fete",
        lista2_fete: "Lista 2 Fete",
        lista1_baieti: "Lista 1 Baieti",
        lista2_baieti: "Lista 2 Baieti",
      };

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const rows = jsonData.slice(1);

          const formattedData = rows
            .filter((row) => row[0] && row[1] && row[3])
            .map((row) => ({
              nume: row[0],
              prenume1: row[1],
              prenume2: row[2],
              gen: row[3],
              frate: row[4] === "DA",
              sora: row[5] === "DA",
            }));

          console.log(`Date încărcate pentru ${category}:`, formattedData);

          // Verificăm dacă numele fișierului este corect
          if (!file.name.includes(expectedNames[category])) {
            setWarnings(`Ai încărcat greșit fișierul pentru ${category}. Fișierul ar trebui să fie ${expectedNames[category]}.xlsx`);
            setUploadedFiles((prev) => ({ ...prev, [category]: false }));
          } else {
            setWarnings("");
            setUploadedFiles((prev) => ({ ...prev, [category]: true }));
            setFileNames((prev) => ({ ...prev, [category]: file.name }));
            onFileUpload(formattedData, category);

            // Actualizăm numărul total de elevi încărcați
            setTotalEleviIncarcati((prevCount) => prevCount + formattedData.length);
          }
        } catch (error) {
          console.error("Eroare la citirea fișierului Excel:", error);
          setWarnings("A apărut o eroare la încărcarea fișierului.");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const resetUploads = () => {
    setUploadedFiles({
      lista1_fete: false,
      lista2_fete: false,
      lista1_baieti: false,
      lista2_baieti: false,
    });
    setWarnings("");
    setFileNames({});
    setTotalEleviIncarcati(0); // Resetăm și numărul total de elevi
  };

  return (
    <div className="FileUploader">
      {state.isAuthenticated ? (
        <>
          <div className="upload-buttons-container">
            <label className={`FileUploader-label ${uploadedFiles.lista1_fete ? "uploaded" : ""}`}>
              {uploadedFiles.lista1_fete ? `Încărcat! (${fileNames.lista1_fete})` : "Încarcă Lista 1 Fete"}
              <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "lista1_fete")} disabled={uploadedFiles.lista1_fete && !warnings} />
            </label>
            <label className={`FileUploader-label ${uploadedFiles.lista2_fete ? "uploaded" : ""}`}>
              {uploadedFiles.lista2_fete ? `Încărcat! (${fileNames.lista2_fete})` : "Încarcă Lista 2 Fete"}
              <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "lista2_fete")} disabled={uploadedFiles.lista2_fete && !warnings} />
            </label>
            <label className={`FileUploader-label ${uploadedFiles.lista1_baieti ? "uploaded" : ""}`}>
              {uploadedFiles.lista1_baieti ? `Încărcat! (${fileNames.lista1_baieti})` : "Încarcă Lista 1 Băieți"}
              <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "lista1_baieti")} disabled={uploadedFiles.lista1_baieti && !warnings} />
            </label>
            <label className={`FileUploader-label ${uploadedFiles.lista2_baieti ? "uploaded" : ""}`}>
              {uploadedFiles.lista2_baieti ? `Încărcat! (${fileNames.lista2_baieti})` : "Încarcă Lista 2 Băieți"}
              <input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e, "lista2_baieti")} disabled={uploadedFiles.lista2_baieti && !warnings} />
            </label>
          </div>

          {/* Afișăm avertismentul dacă există */}
          {warnings && <p className="warning">{warnings}</p>}

          {isLoading && <p>Se încarcă...</p>}

          {/* Afișăm numărul total de elevi încărcați */}
          <p className="total-elevi-incarcati">Ai încărcat un total de {totalEleviIncarcati} elevi.</p>

          {/* Buton de reset */}
          <button className="reset-button" onClick={resetUploads}>
            Resetează
          </button>
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
