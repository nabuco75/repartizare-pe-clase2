import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import { generateExcelForClasses } from "./excelUtil";
import "./RepartizareElevi.css";

function RepartizareElevi({ dataBeforeSept, dataAfterSept, onClaseChange }) {
  const [numarClase, setNumarClase] = useState(0);
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState(20);
  const [claseRepartizate, setClaseRepartizate] = useState([]);
  const [claseRepartizate1, setClaseRepartizate1] = useState([]);
  const [claseRepartizate2, setClaseRepartizate2] = useState([]);
  const [lista2Inexistenta, setLista2Inexistenta] = useState(false);
  const [eleviNerepartizati, setEleviNerepartizati] = useState(0);
  const [error, setError] = useState("");
  const { state: authState } = useAuth();

  useEffect(() => {
    console.log("Data before September:", dataBeforeSept);
    console.log("Data after September:", dataAfterSept);
  }, [dataBeforeSept, dataAfterSept]);

  const sortAndDistribute = (students, numClasses) => {
    if (!Array.isArray(students) || students.some((student) => !student.nume)) {
      console.error("Invalid student data:", students);
      return [];
    }

    const sorted = students.sort((a, b) => {
      if (a.nume.localeCompare(b.nume) === 0) {
        return a.prenume.localeCompare(b.prenume);
      }
      return a.nume.localeCompare(b.nume);
    });

    return distributeStudents(sorted, numClasses);
  };

  const distributeStudents = (students, numClasses) => {
    const classes = Array.from({ length: numClasses }, () => []);
    let currentClassIndex = 0;

    students.forEach((student) => {
      classes[currentClassIndex].push(student);
      currentClassIndex = (currentClassIndex + 1) % numClasses;
    });

    return classes;
  };

  const integrateAdditionalStudents = (existingClasses, newStudents) => {
    const numClasses = existingClasses.length;
    let currentClassIndex = 0;

    newStudents.forEach((student) => {
      existingClasses[currentClassIndex].push(student);
      currentClassIndex = (currentClassIndex + 1) % numClasses;
    });
  };

  const repartizeazaElevi = () => {
    if (!authState.isAuthenticated) {
      setError("Trebuie să fiți autentificat pentru a efectua repartizarea.");
      return;
    }

    if (!lista2Inexistenta && dataAfterSept.length === 0) {
      setError("Atentie, nu ai incarcat lista 2. Daca nu exista, bifeaza campul de mai jos.");
      return;
    }

    setError("");

    const totalStudents1 = dataBeforeSept.length;
    const totalStudents2 = lista2Inexistenta ? 0 : dataAfterSept.length;
    const totalStudents = totalStudents1 + totalStudents2;
    const maxStudentsInClasses = numarClase * numarEleviPeClasa;
    const studentsLeftUnassigned = Math.max(totalStudents - maxStudentsInClasses, 0);

    setEleviNerepartizati(studentsLeftUnassigned);

    if (totalStudents === 0) {
      setError("Nu există elevi pentru repartizare.");
      return;
    }

    if (numarClase <= 0) {
      setError("Introduceți un număr valid de clase.");
      return;
    }

    console.log("Repartizează elevi...");

    // Repartizează și afișează lista 1
    const classes1 = sortAndDistribute(dataBeforeSept, numarClase);
    setClaseRepartizate1(classes1);

    // Repartizează lista 2 și unifică clasele
    let finalClasses = classes1.map((clasa) => [...clasa]);
    if (!lista2Inexistenta) {
      const classes2 = sortAndDistribute(dataAfterSept, numarClase);
      setClaseRepartizate2(classes2);
      integrateAdditionalStudents(finalClasses, dataAfterSept);
    }

    const sortedFinalClasses = finalClasses.map((clasa) => clasa.sort((a, b) => a.nume.localeCompare(b.nume)));
    setClaseRepartizate(sortedFinalClasses);
    onClaseChange(sortedFinalClasses);
  };

  const handleDownload = () => {
    generateExcelForClasses(claseRepartizate);
  };

  const resetSettings = () => {
    setNumarClase(0);
    setNumarEleviPeClasa(20);
    setClaseRepartizate([]);
    setClaseRepartizate1([]);
    setClaseRepartizate2([]);
    setLista2Inexistenta(false);
    setEleviNerepartizati(0);
    setError("");
  };

  return (
    <div className="repartizare-elevi-container">
      <h2 className="title">Repartizarea elevilor pe clase</h2>
      <div className="input-group">
        <div>
          <label className="label">Număr de clase:</label>
          <select className="dropdown" value={numarClase} onChange={(e) => setNumarClase(parseInt(e.target.value) || 0)}>
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Număr maxim de elevi per clasă:</label>
          <select className="dropdown" value={numarEleviPeClasa} onChange={(e) => setNumarEleviPeClasa(parseInt(e.target.value) || 0)}>
            {Array.from({ length: 16 }, (_, i) => 10 + i).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="checkbox-container">
          <input type="checkbox" id="lista2Inexistenta" checked={lista2Inexistenta} onChange={() => setLista2Inexistenta(!lista2Inexistenta)} />
          <label htmlFor="lista2Inexistenta" className="checkbox-label">
            Nu există lista 2 (cu elevi care împlinesc 6 ani după 1 septembrie)
          </label>
        </div>
      </div>
      {authState.isAuthenticated && (
        <div className="button-group">
          <button className="button" onClick={repartizeazaElevi}>
            Repartizează
          </button>
          <button className="button reset-button" onClick={resetSettings}>
            Reset
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {eleviNerepartizati > 0 && (
        <div className="warning">
          Ai ales {numarClase} clase a {numarEleviPeClasa} elevi. {eleviNerepartizati} elevi vor fi nerepartizați.
        </div>
      )}

      {claseRepartizate1.length > 0 && (
        <div className="clase-repartizate">
          <h3 className="subtitle">Repartizare lista 1:</h3>
          {claseRepartizate1.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4 className="clasa-title">
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul className="lista-elevi">
                {clasa.map((elev, idx) => (
                  <li key={idx} className="elev">
                    {elev.nume} {elev.prenume}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {claseRepartizate2.length > 0 && (
        <div className="clase-repartizate">
          <h3 className="subtitle">Repartizare lista 2:</h3>
          {claseRepartizate2.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4 className="clasa-title">
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul className="lista-elevi">
                {clasa.map((elev, idx) => (
                  <li key={idx} className="elev">
                    {elev.nume} {elev.prenume}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {claseRepartizate.length > 0 && (
        <div className="clase-repartizate">
          <h3 className="subtitle">Clase finale reunite:</h3>
          {claseRepartizate.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4 className="clasa-title">
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul className="lista-elevi">
                {clasa.map((elev, idx) => (
                  <li key={idx} className="elev">
                    {elev.nume} {elev.prenume}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="button-container">
            <button className="button" onClick={handleDownload}>
              Descarcă
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

RepartizareElevi.propTypes = {
  dataBeforeSept: PropTypes.array.isRequired,
  dataAfterSept: PropTypes.array.isRequired,
  onClaseChange: PropTypes.func.isRequired,
};

export default RepartizareElevi;
