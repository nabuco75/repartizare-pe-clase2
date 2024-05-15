import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";

function RepartizareElevi({ dataBeforeSept, dataAfterSept, onClaseChange }) {
  const [numarClase, setNumarClase] = useState(0);
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState(22); // Default maximum number of students per class
  const [claseRepartizate, setClaseRepartizate] = useState([]);
  const [claseRepartizate1, setClaseRepartizate1] = useState([]);
  const [claseRepartizate2, setClaseRepartizate2] = useState([]);
  const [lista2Inexistenta, setLista2Inexistenta] = useState(false);
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

    const sorted = students.sort((a, b) => a.nume.localeCompare(b.nume));
    return distributeStudents(sorted, numClasses);
  };

  const distributeStudents = (students, numClasses) => {
    const classes = Array.from({ length: numClasses }, () => []);
    let currentClassIndex = 0;

    const distributeByGender = (students, gender) => {
      students
        .filter((student) => student.gen === gender)
        .forEach((student) => {
          classes[currentClassIndex].push(student);
          currentClassIndex = (currentClassIndex + 1) % numClasses;
        });
    };

    distributeByGender(students, "F");
    distributeByGender(students, "M");

    return classes;
  };

  const integrateAdditionalStudents = (existingClasses, newStudents) => {
    const numClasses = existingClasses.length;
    let currentClassIndex = 0;

    const distributeByGender = (students, gender) => {
      students
        .filter((student) => student.gen === gender)
        .forEach((student) => {
          while (existingClasses[currentClassIndex].length >= numarEleviPeClasa) {
            currentClassIndex = (currentClassIndex + 1) % numClasses;
          }
          existingClasses[currentClassIndex].push(student);
          currentClassIndex = (currentClassIndex + 1) % numClasses;
        });
    };

    distributeByGender(newStudents, "F");
    distributeByGender(newStudents, "M");
  };

  const repartizeazaElevi = () => {
    if (!authState.isAuthenticated) {
      alert("Trebuie să fiți autentificat pentru a efectua repartizarea.");
      return;
    }

    if (!lista2Inexistenta && dataAfterSept.length === 0) {
      alert("Lista 2 este goală. Verificați bifarea sau încărcarea listei.");
      return;
    }

    const totalStudents1 = dataBeforeSept.length;
    const totalStudents2 = lista2Inexistenta ? 0 : dataAfterSept.length;
    const totalStudents = totalStudents1 + totalStudents2;

    if (totalStudents === 0) {
      alert("Nu există elevi pentru repartizare.");
      return;
    }

    if (numarClase <= 0) {
      alert("Introduceți un număr valid de clase.");
      return;
    }

    console.log("Repartizează elevi...");

    const classes1 = sortAndDistribute(dataBeforeSept, numarClase);
    setClaseRepartizate1(classes1);

    let classes2 = [];
    if (!lista2Inexistenta) {
      classes2 = sortAndDistribute(dataAfterSept, numarClase);
      setClaseRepartizate2(classes2);
    }

    let finalClasses = classes1.map((clasa) => [...clasa]);
    if (!lista2Inexistenta) {
      integrateAdditionalStudents(finalClasses, dataAfterSept);
    }

    const sortedFinalClasses = finalClasses.map((clasa) => clasa.sort((a, b) => a.nume.localeCompare(b.nume)));

    setClaseRepartizate(sortedFinalClasses);
    onClaseChange(sortedFinalClasses);
  };

  return (
    <div className="repartizare-elevi-container">
      <h2>Repartizarea elevilor pe clase</h2>
      <input type="number" value={numarClase} onChange={(e) => setNumarClase(parseInt(e.target.value) || 0)} placeholder="Număr de clase" />
      <input type="number" value={numarEleviPeClasa} onChange={(e) => setNumarEleviPeClasa(parseInt(e.target.value) || 0)} placeholder="Număr maxim de elevi per clasă" />
      <label>
        <input type="checkbox" checked={lista2Inexistenta} onChange={() => setLista2Inexistenta(!lista2Inexistenta)} />
        Nu există lista 2 (cu elevi care împlinesc 6 ani după 1 septembrie)
      </label>
      {authState.isAuthenticated && <button onClick={repartizeazaElevi}>Repartizează</button>}
      {claseRepartizate1.length > 0 && (
        <div className="clase-repartizate">
          <h3>Repartizare lista 1:</h3>
          {claseRepartizate1.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4>
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul>
                {clasa.map((elev, idx) => (
                  <li key={idx}>
                    {elev.nume} ({elev.gen})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {claseRepartizate2.length > 0 && (
        <div className="clase-repartizate">
          <h3>Repartizare lista 2:</h3>
          {claseRepartizate2.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4>
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul>
                {clasa.map((elev, idx) => (
                  <li key={idx}>
                    {elev.nume} ({elev.gen})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {claseRepartizate.length > 0 && (
        <div className="clase-repartizate">
          <h3>Clase finale reunite:</h3>
          {claseRepartizate.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4>
                Clasa {index + 1}: {clasa.length} elevi
              </h4>
              <ul>
                {clasa.map((elev, idx) => (
                  <li key={idx}>
                    {elev.nume} ({elev.gen})
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
