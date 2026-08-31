import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import { generateExcelForClasses } from "./excelUtil";
import "./RepartizareElevi.css";

const sortByName = (a, b) => a.nume.localeCompare(b.nume, "ro");

// Fiecare coadă (listă × gen) este independentă și pornește de la clasa A:
// al k-lea elev din coadă intră în clasa k % numarClase.
// Nu se rebalansează după mărimea claselor — mărimile ies cum ies (ex. 23/22/21/21),
// exact ca în repartizarea făcută manual.
const distributeAll = (lista1, lista2, numarClase) => {
  const classes = Array.from({ length: numarClase }, () => []);

  const queues = [
    [...lista1.fete].sort(sortByName),
    [...lista2.fete].sort(sortByName),
    [...lista1.baieti].sort(sortByName),
    [...lista2.baieti].sort(sortByName),
    [...lista1.limbaMat].sort(sortByName),
    [...lista2.limbaMat].sort(sortByName),
  ];

  for (const queue of queues) {
    queue.forEach((elev, k) => classes[k % numarClase].push(elev));
  }

  return classes;
};

function RepartizareElevi({ lista1, lista2, ces, gemeniPairs, onClaseChange }) {
  const [numarClase, setNumarClase] = useState(1);
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState(20);
  const [lista2Inexistenta, setLista2Inexistenta] = useState(false);
  const [claseRepartizate, setClaseRepartizate] = useState([]);
  const [depasiri, setDepasiri] = useState([]);
  const [error, setError] = useState("");
  const [gemeniDecizii, setGemeniDecizii] = useState({});
  const { state: authState } = useAuth();

  const totalLista1 = lista1.fete.length + lista1.baieti.length + lista1.limbaMat.length;
  const totalLista2 = lista2.fete.length + lista2.baieti.length + lista2.limbaMat.length;

  const repartizeaza = () => {
    if (!authState.isAuthenticated) {
      setError("Trebuie să fiți autentificat pentru a efectua repartizarea.");
      return;
    }
    if (gemeniPairs === null) {
      setError("Confirmați mai întâi situația gemenilor (secțiunea de mai sus).");
      return;
    }
    if (totalLista1 === 0) {
      setError("Nu există elevi în Lista 1.");
      return;
    }
    if (!lista2Inexistenta && totalLista2 === 0) {
      setError("Nu ai încărcat Lista 2. Dacă nu există, bifează câmpul de mai jos.");
      return;
    }
    if (numarClase <= 0) {
      setError("Introduceți un număr valid de clase.");
      return;
    }

    setError("");

    const lista2Efectiva = lista2Inexistenta
      ? { fete: [], baieti: [], limbaMat: [] }
      : lista2;

    const classes = distributeAll(lista1, lista2Efectiva, numarClase);
    const sortedClasses = classes.map((c) => [...c].sort(sortByName));
    setClaseRepartizate(sortedClasses);
    onClaseChange(sortedClasses);

    // Maximul e doar prag de avertizare — repartizarea nu mută elevi ca să egalizeze clasele
    setDepasiri(
      sortedClasses
        .map((c, i) => ({ litera: String.fromCharCode(65 + i), nr: c.length }))
        .filter((c) => c.nr > numarEleviPeClasa)
    );

    if (gemeniPairs.length > 0) {
      const decizii = {};
      gemeniPairs.forEach((_, idx) => { decizii[idx] = "aceeasi"; });
      setGemeniDecizii(decizii);
    } else {
      setGemeniDecizii({});
    }
  };

  const applyGemeni = () => {
    const newClasses = claseRepartizate.map((c) => [...c]);

    gemeniPairs.forEach(([s1, s2], idx) => {
      if (gemeniDecizii[idx] !== "aceeasi") return;

      let targetIdx = -1;
      for (let i = 0; i < newClasses.length; i++) {
        if (newClasses[i].some((e) => e.cnp === s1.cnp)) {
          targetIdx = i;
          break;
        }
      }
      if (targetIdx === -1) return;

      for (let i = 0; i < newClasses.length; i++) {
        if (i === targetIdx) continue;
        const pos = newClasses[i].findIndex((e) => e.cnp === s2.cnp);
        if (pos !== -1) {
          const [moved] = newClasses[i].splice(pos, 1);
          newClasses[targetIdx].push(moved);
          break;
        }
      }
    });

    const sorted = newClasses.map((c) => [...c].sort(sortByName));
    setClaseRepartizate(sorted);
    onClaseChange(sorted);
  };

  const resetAll = () => {
    setNumarClase(1);
    setNumarEleviPeClasa(20);
    setClaseRepartizate([]);
    setLista2Inexistenta(false);
    setDepasiri([]);
    setError("");
    setGemeniDecizii({});
  };

  return (
    <div className="repartizare-elevi-container">
      <h2 className="title">Repartizarea elevilor pe clase</h2>

      <div className="input-group">
        <div>
          <label className="label">Număr de clase:</label>
          <select
            className="dropdown"
            value={numarClase}
            onChange={(e) => setNumarClase(parseInt(e.target.value) || 1)}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Număr maxim de elevi per clasă (prag de avertizare):</label>
          <select
            className="dropdown"
            value={numarEleviPeClasa}
            onChange={(e) => setNumarEleviPeClasa(parseInt(e.target.value) || 20)}
          >
            {Array.from({ length: 16 }, (_, i) => 10 + i).map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="lista2Inexistenta"
            checked={lista2Inexistenta}
            onChange={() => setLista2Inexistenta((v) => !v)}
          />
          <label htmlFor="lista2Inexistenta" className="checkbox-label">
            Nu există Lista 2 (elevi care împlinesc 6 ani după 1 septembrie)
          </label>
        </div>
      </div>

      {authState.isAuthenticated && (
        <div className="button-group">
          <button className="button" onClick={repartizeaza}>
            Repartizează
          </button>
          <button className="button reset-button" onClick={resetAll}>
            Reset
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {depasiri.length > 0 && (
        <div className="warning">
          Atenție: {depasiri.map((c) => `clasa ${c.litera} are ${c.nr} elevi`).join(", ")} — peste
          maximul de {numarEleviPeClasa}. Măriți numărul de clase sau mutați manual elevi.
        </div>
      )}

      {claseRepartizate.length > 0 && gemeniPairs && gemeniPairs.length > 0 && (
        <div className="gemeni-section">
          <h3 className="subtitle">Decizie gemeni</h3>
          <table className="gemeni-table">
            <thead>
              <tr>
                <th>Geamăn 1</th>
                <th>Clasa atribuită</th>
                <th>Geamăn 2</th>
                <th>Clasa atribuită</th>
                <th>Decizie părinți</th>
              </tr>
            </thead>
            <tbody>
              {gemeniPairs.map(([s1, s2], idx) => {
                const cls1 = claseRepartizate.findIndex((c) => c.some((e) => e.cnp === s1.cnp));
                const cls2 = claseRepartizate.findIndex((c) => c.some((e) => e.cnp === s2.cnp));
                return (
                  <tr key={idx}>
                    <td>{s1.nume} {s1.prenume1}</td>
                    <td>Clasa {cls1 >= 0 ? String.fromCharCode(65 + cls1) : "—"}</td>
                    <td>{s2.nume} {s2.prenume1}</td>
                    <td>Clasa {cls2 >= 0 ? String.fromCharCode(65 + cls2) : "—"}</td>
                    <td>
                      <label className="gemeni-radio-label">
                        <input
                          type="radio"
                          name={`gemeni_${idx}`}
                          value="aceeasi"
                          checked={gemeniDecizii[idx] === "aceeasi"}
                          onChange={() => setGemeniDecizii((d) => ({ ...d, [idx]: "aceeasi" }))}
                        />
                        {" "}Aceeași clasă
                      </label>
                      <label className="gemeni-radio-label">
                        <input
                          type="radio"
                          name={`gemeni_${idx}`}
                          value="diferite"
                          checked={gemeniDecizii[idx] === "diferite"}
                          onChange={() => setGemeniDecizii((d) => ({ ...d, [idx]: "diferite" }))}
                        />
                        {" "}Clase diferite
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="button-container">
            <button className="button" onClick={applyGemeni}>
              Aplică deciziile pentru gemeni
            </button>
          </div>
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
                    {idx + 1}. {elev.nume} {elev.prenume1} {elev.prenume2} {elev.prenume3}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="button-container">
            <button className="button" onClick={() => generateExcelForClasses(claseRepartizate, ces)}>
              Descarcă Excel
            </button>
          </div>
        </div>
      )}

      {ces.length > 0 && (
        <div className="ces-section">
          <h3 className="subtitle">Elevi CES — de repartizat manual ({ces.length})</h3>
          <p className="ces-hint">
            Nu intră în repartizarea automată; se repartizează prin decizia comisiei.
          </p>
          <ul className="lista-elevi">
            {[...ces].sort(sortByName).map((elev) => (
              <li key={elev.cnp} className="elev">
                {elev.nume} {elev.prenume1} {elev.prenume2} {elev.prenume3}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

RepartizareElevi.propTypes = {
  lista1: PropTypes.shape({
    fete:     PropTypes.array.isRequired,
    baieti:   PropTypes.array.isRequired,
    limbaMat: PropTypes.array.isRequired,
  }).isRequired,
  lista2: PropTypes.shape({
    fete:     PropTypes.array.isRequired,
    baieti:   PropTypes.array.isRequired,
    limbaMat: PropTypes.array.isRequired,
  }).isRequired,
  ces:           PropTypes.array,
  gemeniPairs:   PropTypes.array,
  onClaseChange: PropTypes.func.isRequired,
};

RepartizareElevi.defaultProps = {
  ces:         [],
  gemeniPairs: null,
};

export default RepartizareElevi;
