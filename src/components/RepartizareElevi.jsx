import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import "./RepartizareElevi.css";

function RepartizareElevi({ data, onClaseChange }) {
  const [numarClase, setNumarClase] = useState("");
  const [numarEleviPeClasa, setNumarEleviPeClasa] = useState("");
  const [listaElevi, setListaElevi] = useState([]);
  const [claseRepartizate, setClaseRepartizate] = useState([]);
  const { state: authState } = useAuth();

  useEffect(() => {
    if (data && data.length > 0) {
      setListaElevi(data);
    }
  }, [data]);

  const handleRepartizare = () => {
    if (!numarClase || !numarEleviPeClasa || !data || data.length === 0) {
      alert("Toate câmpurile trebuie completate și trebuie încărcată o listă de elevi.");
      return;
    }
    if (!authState.isAuthenticated) {
      alert("Trebuie să fiți autentificat pentru a efectua repartizarea.");
      return;
    }

    // Verificăm dacă fiecare obiect din lista de elevi are o proprietate 'nume' definită
    if (listaElevi.some((elev) => !elev.nume)) {
      alert("Lista de elevi este invalidă. Asigurați-vă că fiecare elev are o proprietate 'nume' definită.");
      return;
    }

    const eleviSortati = [...listaElevi].sort((a, b) => {
      // Verificăm dacă fiecare elev are o proprietate 'nume' definită
      if (!a.nume || !b.nume) {
        return 0; // În cazul în care unul dintre elevi nu are 'nume', le considerăm egali
      }
      return a.nume.localeCompare(b.nume, "ro");
    });

    const fete = eleviSortati.filter((elev) => elev.gen === "F");
    const baieti = eleviSortati.filter((elev) => elev.gen === "M");

    let clase = Array.from({ length: parseInt(numarClase) }, () => []);

    fete.forEach((fata, index) => {
      const clasaIndex = index % parseInt(numarClase);
      if (clase[clasaIndex].length < parseInt(numarEleviPeClasa)) {
        clase[clasaIndex].push(fata);
      }
    });

    baieti.forEach((baiat, index) => {
      const clasaIndex = index % parseInt(numarClase);
      if (clase[clasaIndex].length < parseInt(numarEleviPeClasa)) {
        clase[clasaIndex].push(baiat);
      }
    });

    setClaseRepartizate(clase);
    onClaseChange(clase);
  };

  return (
    <div className="repartizare-elevi-container">
      <h2>Repartizarea elevilor pe clase</h2>

      <select value={numarClase} onChange={(e) => setNumarClase(e.target.value)}>
        <option value="">Selectează numărul de clase</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((numar) => (
          <option key={numar} value={numar}>
            {numar} clase
          </option>
        ))}
      </select>

      <select value={numarEleviPeClasa} onChange={(e) => setNumarEleviPeClasa(e.target.value)}>
        <option value="">Selectează nr. elevi pe clasă</option>
        {Array.from({ length: 30 }, (_, i) => i + 10).map((numar) => (
          <option key={numar} value={numar}>
            {numar} elevi
          </option>
        ))}
      </select>

      {authState.isAuthenticated && <button onClick={handleRepartizare}>Repartizează</button>}

      {claseRepartizate.length > 0 && (
        <div className="clase-repartizate">
          {claseRepartizate.map((clasa, index) => (
            <div className="clasa" key={index}>
              <h3>
                Clasa {index + 1}: {clasa.length} elevi
              </h3>
              {/* Detalii suplimentare despre elevii repartizați pot fi afișate aici */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

RepartizareElevi.propTypes = {
  file: PropTypes.object,
  onClaseChange: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default RepartizareElevi;
