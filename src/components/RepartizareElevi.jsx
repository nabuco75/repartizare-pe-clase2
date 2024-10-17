import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import { generateExcelForClasses } from "./excelUtil";
import "./RepartizareElevi.css";

function RepartizareElevi({ dataBeforeSept, dataAfterSept, onClaseChange }) {
  const [numarClase, setNumarClase] = useState(0);
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState(20);
  const [claseRepartizate, setClaseRepartizate] = useState([]);
  const [lista2Inexistenta, setLista2Inexistenta] = useState(false);
  const [eleviNerepartizati, setEleviNerepartizati] = useState(0);
  const [error, setError] = useState("");
  const { state: authState } = useAuth();

  useEffect(() => {
    console.log("Data before September:", dataBeforeSept);
    console.log("Data after September:", dataAfterSept);
  }, [dataBeforeSept, dataAfterSept]);

  const validateStudentData = (students) => {
    return students.every((student) => {
      const valid = student.nume && student.prenume1 && student.gen && (student.gen === "M" || student.gen === "F");
      if (!valid) {
        console.error("Invalid student data:", student);
      }
      return valid;
    });
  };

  const separateAndSortStudents = (students) => {
    const sortByName = (a, b) => a.nume.localeCompare(b.nume);
    return {
      F: students.filter((s) => s.gen === "F").sort(sortByName),
      M: students.filter((s) => s.gen === "M").sort(sortByName),
    };
  };

  const distributeStudentsNewAlgorithm = (studentsList1, studentsList2, numClasses) => {
    if (!validateStudentData(studentsList1) || (!lista2Inexistenta && !validateStudentData(studentsList2))) {
      console.error("Invalid student data.");
      return [];
    }

    const list1 = separateAndSortStudents(studentsList1);
    const list2 = lista2Inexistenta ? { F: [], M: [] } : separateAndSortStudents(studentsList2);

    const classes = Array.from({ length: numClasses }, () => []);
    let currentClassIndex = 0;
    const maxStudentsPerClass = numarEleviPeClasa;

    // Funcția pentru adăugarea elevilor în clase
    const addStudentToClass = (student) => {
      if (classes[currentClassIndex].length >= maxStudentsPerClass) {
        currentClassIndex = (currentClassIndex + 1) % numClasses;
      }
      classes[currentClassIndex].push(student);
    };

    // Funcția principală de alternare și distribuire
    const distribute = () => {
      let totalStudentsAdded = 0;

      while (list1.F.length > 0 || list1.M.length > 0 || list2.F.length > 0 || list2.M.length > 0) {
        // Adăugăm 1 fată din Lista 1
        if (list1.F.length > 0) {
          addStudentToClass(list1.F.shift());
          totalStudentsAdded++;
        }

        // Adăugăm 1 fată din Lista 2 (dacă există)
        if (list2.F.length > 0) {
          addStudentToClass(list2.F.shift());
          totalStudentsAdded++;
        } else if (list1.F.length > 0) {
          // Dacă lista 2 fete s-a terminat, continuăm cu lista 1 fete
          addStudentToClass(list1.F.shift());
          totalStudentsAdded++;
        }

        // Adăugăm 1 băiat din Lista 1
        if (list1.M.length > 0) {
          addStudentToClass(list1.M.shift());
          totalStudentsAdded++;
        }

        // Adăugăm 1 băiat din Lista 2 (dacă există)
        if (list2.M.length > 0) {
          addStudentToClass(list2.M.shift());
          totalStudentsAdded++;
        } else if (list1.M.length > 0) {
          // Dacă lista 2 băieți s-a terminat, continuăm cu lista 1 băieți
          addStudentToClass(list1.M.shift());
          totalStudentsAdded++;
        }

        // După fiecare 4 copii, trecem la următoarea clasă
        if (totalStudentsAdded >= 4) {
          currentClassIndex = (currentClassIndex + 1) % numClasses;
          totalStudentsAdded = 0;
        }
      }
    };

    distribute();
    return classes;
  };

  const repartizeazaElevi = () => {
    if (!authState.isAuthenticated) {
      setError("Trebuie să fiți autentificat pentru a efectua repartizarea.");
      return;
    }

    if (!lista2Inexistenta && dataAfterSept.length === 0) {
      setError("Atenție, nu ai încărcat lista 2. Dacă nu există, bifează câmpul de mai jos.");
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

    const classes = distributeStudentsNewAlgorithm(dataBeforeSept, lista2Inexistenta ? [] : dataAfterSept, numarClase);

    const sortedClasses = classes.map((clasa) => clasa.sort((a, b) => a.nume.localeCompare(b.nume)));

    setClaseRepartizate(sortedClasses);
    onClaseChange(sortedClasses);
  };

  const handleDownload = () => {
    generateExcelForClasses(claseRepartizate);
  };

  const resetSettings = () => {
    setNumarClase(0);
    setNumarEleviPeClasa(20);
    setClaseRepartizate([]);
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

      {claseRepartizate.length > 0 && (
        <div className="clase-repartizate">
          <h3 className="subtitle">Clasele repartizate:</h3>
          {claseRepartizate.map((clasa, index) => (
            <div key={index} className="clasa">
              <h4 className="clasa-title">
                Clasa {String.fromCharCode(65 + index)}: {clasa.length} elevi
              </h4>
              <ul className="lista-elevi">
                {clasa.map((elev, idx) => (
                  <li key={idx} className="elev">
                    {elev.nume} {elev.prenume1} {elev.prenume2}
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
