import React from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext"; // Importul useAuth din Context API

function GenerateExcel({ data }) {
  const { state: authState } = useAuth(); // Obțineți starea de autentificare

  const generateExcelFiles = () => {
    // Verificați dacă utilizatorul este autentificat și datele sunt disponibile
    if (authState.isAuthenticated && data && data.length > 0) {
      // Iterăm prin fiecare clasă
      data.forEach((clasaData, index) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(clasaData);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Clasa_${index + 1}`);
        XLSX.writeFile(workbook, `Clasa_${index + 1}.xlsx`);
      });
    } else {
      alert("Trebuie să vă autentificați și să furnizați date pentru a descărca Excel.");
    }
  };

  return (
    <div>
      <button onClick={generateExcelFiles}>Generare Excel pentru fiecare clasă</button>
    </div>
  );
}

GenerateExcel.propTypes = {
  data: PropTypes.array.isRequired,
};

export default GenerateExcel;
