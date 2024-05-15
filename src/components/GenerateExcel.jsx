import React, { useState } from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import "./GenerateExcel.css";

function GenerateExcel({ data }) {
  const { state: authState } = useAuth(); // Obțineți starea de autentificare
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExcelFiles = () => {
    if (!authState.isAuthenticated || !data || data.length === 0) {
      alert("Trebuie să fiți autentificat și să furnizați date pentru a descărca Excel.");
      return;
    }

    setIsGenerating(true);
    try {
      data.forEach((clasaData, index) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(clasaData);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Clasa_${index + 1}`);
        XLSX.writeFile(workbook, `Clasa_${index + 1}.xlsx`);
      });
    } catch (error) {
      console.error("A apărut o eroare în timpul generării fișierelor Excel:", error);
      alert("A apărut o eroare în timpul generării fișierelor Excel.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-excel-container">
      <button className="generate-excel-button" onClick={generateExcelFiles} disabled={!authState.isAuthenticated || !(data && data.length > 0) || isGenerating}>
        {isGenerating ? "Generare în curs..." : "Generare Excel pentru fiecare clasă"}
      </button>
    </div>
  );
}

GenerateExcel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired, // Modificare pentru a reflecta mai clar structura așteptată a datelor
};

export default GenerateExcel;
