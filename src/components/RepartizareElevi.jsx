import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "./AuthContext";
import "./RepartizareElevi.css";

function RepartizareElevi() {
  const [numarClase, setNumarClase] = useState("");
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState("");
  const [clase, setClase] = useState([]); // Starea pentru a stoca clasele repartizate
  const { state: authState } = useAuth();

  const handleNumarClaseChange = (e) => {
    setNumarClase(e.target.value);
  };

  const handleNumarEleviPeClasaChange = (e) => {
    setNumarEleviPeClasa(e.target.value);
  };

  const handleRepartizare = () => {
    if (numarClase && numarEleviPeClasa && authState.isAuthenticated) {
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
        const claseRepartizate = Array.from({ length: numarClase }, () => []);
        let indexClasa = 0;

        // Repartizăm întâi fetele
        eleviSortati
          .filter((e) => e.gen === "F")
          .forEach((elev) => {
            claseRepartizate[indexClasa % numarClase].push(elev);
            indexClasa++;
          });

        // Apoi repartizăm băieții
        eleviSortati
          .filter((e) => e.gen === "M")
          .forEach((elev) => {
            claseRepartizate[indexClasa % numarClase].push(elev);
            indexClasa++;
          });

        // Actualizăm starea cu clasele repartizate
        setClase(claseRepartizate);
      };
    } else if (!authState.isAuthenticated) {
      alert("Trebuie să fiți autentificat pentru a efectua repartizarea.");
    } else {
      alert("Selectează un fișier, numărul de clase și numărul de elevi pe clasă!");
    }
  };

  return (
    <div className="repartizare-elevi-container">
      <h2>Repartizarea elevilor pe clase</h2>
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
      {authState.isAuthenticated && (
        <div>
          <button onClick={handleRepartizare}>Repartizează</button>
          {clase.length > 0 && (
            <div>
              <h3>Repartizare pe clase:</h3>
              {clase.map((clasa, index) => (
                <div key={index}>
                  Clasa {index + 1}: {clasa.length} elevi
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RepartizareElevi;
