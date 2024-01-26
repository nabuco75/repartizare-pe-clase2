import React, { useState } from "react";
import GeneratePDFButton from "./GeneratePDFButton";
import * as XLSX from "xlsx"; // Importă XLSX
import FileUploader from "./FileUploader";

function RepartizareElevi() {
  const [file, setFile] = useState(null);
  const [numarClase, setNumarClase] = useState("");
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState("");
  const [clase, setClase] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNumarClaseChange = (e) => {
    setNumarClase(e.target.value);
  };

  const handleNumarEleviPeClasaChange = (e) => {
    setNumarEleviPeClasa(e.target.value);
  };

  const handleRepartizare = () => {
    if (file && numarClase && numarEleviPeClasa) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Sortăm lista de elevi alfabetic, având grijă la diacritice
        const eleviSortati = jsonData.sort((a, b) => a.nume.localeCompare(b.nume, "ro"));

        // Distribuim elevii în clase
        const clase = Array.from({ length: numarClase }, () => []);
        let indexClasa = 0;

        // Repartizăm întâi fetele
        eleviSortati
          .filter((e) => e.gen === "F")
          .forEach((elev) => {
            clase[indexClasa % numarClase].push(elev);
            indexClasa++;
          });

        // Apoi repartizăm băieții
        eleviSortati
          .filter((e) => e.gen === "M")
          .forEach((elev) => {
            clase[indexClasa % numarClase].push(elev);
            indexClasa++;
          });

        // Actualizăm starea cu clasele repartizate
        setClase(clase);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Selectează un fișier, numărul de clase și numărul de elevi pe clasă!");
    }
  };

  return (
    <div>
      <h2>Repartizarea elevilor pe clase</h2>
      <FileUploader onFileUpload={handleFileChange} /> {/* Aici adăugăm FileUploader cu handlerul corect */}
      <select value={numarClase} onChange={handleNumarClaseChange}>
        <option value="">Selectează numărul de clase</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((numar) => (
          <option key={numar} value={numar}>
            {numar} clase
          </option>
        ))}
      </select>
      <select value={numarEleviPeClasa} onChange={handleNumarEleviPeClasaChange}>
        <option value="">Selectează nr. elevi pe clasă</option>
        {Array.from({ length: 13 }, (_, i) => i + 10).map((numar) => (
          <option key={numar} value={numar}>
            {numar} elevi
          </option>
        ))}
      </select>
      <button onClick={handleRepartizare}>Repartizează</button>
      {/* Adăugăm componenta pentru generarea PDF-ului */}
      {clase.length > 0 && <GeneratePDFButton clase={clase} />}
    </div>
  );
}

export default RepartizareElevi;
