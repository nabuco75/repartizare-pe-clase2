import React from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext"; // Importați hook-ul de autentificare

function GenerateExcel({ clase }) {
  const { state: authState } = useAuth(); // Obțineți starea de autentificare

  const generateExcelFile = () => {
    // Verificați dacă utilizatorul este autentificat înainte de a permite descărcarea
    if (authState.isAuthenticated) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(clase);
      XLSX.utils.sheet_add_json(worksheet, clase, { header: ["Nume", "Prenume", "Gen"], skipHeader: true });
      XLSX.utils.book_append_sheet(workbook, worksheet, "RepartizareElevi");
      XLSX.writeFile(workbook, "RepartizareElevi.xlsx");
    } else {
      alert("Trebuie să vă autentificați pentru a descărca Excel.");
    }
  };

  return (
    <div>
      <button onClick={generateExcelFile}>Generare Excel</button>
    </div>
  );
}

GenerateExcel.propTypes = {
  clase: PropTypes.array.isRequired,
};

export default GenerateExcel;
