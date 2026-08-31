import React, { useState } from "react";
import PropTypes from "prop-types";
import "./GemeniSelector.css";

function GemeniSelector({ allStudents, onConfirm }) {
  const [pairs, setPairs] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const sorted = [...allStudents].sort((a, b) =>
    `${a.nume} ${a.prenume1}`.localeCompare(`${b.nume} ${b.prenume1}`, "ro")
  );

  const addPair = () =>
    setPairs((p) => [...p, { id: Date.now(), s1: "", s2: "" }]);

  const removePair = (id) =>
    setPairs((p) => p.filter((pair) => pair.id !== id));

  const updatePair = (id, field, cnp) =>
    setPairs((p) =>
      p.map((pair) => (pair.id === id ? { ...pair, [field]: cnp } : pair))
    );

  const validPairs = pairs.filter((p) => p.s1 && p.s2 && p.s1 !== p.s2);
  const allPairsValid = pairs.length > 0 && validPairs.length === pairs.length;

  const handleConfirm = () => {
    const result = validPairs.map((p) => [
      allStudents.find((s) => s.cnp === p.s1),
      allStudents.find((s) => s.cnp === p.s2),
    ]);
    setConfirmed(true);
    onConfirm(result);
  };

  const handleNoTwins = () => {
    setConfirmed(true);
    onConfirm([]);
  };

  const handleModifica = () => {
    setConfirmed(false);
    onConfirm(null);
  };

  if (confirmed) {
    return (
      <div className="gemeni-selector gemeni-confirmed-bar">
        <span className="gemeni-confirmed-text">
          {validPairs.length === 0
            ? "Nu există gemeni ✓"
            : `${validPairs.length} pereche${validPairs.length > 1 ? "i" : ""} de gemeni ✓`}
        </span>
        <button className="button-link" onClick={handleModifica}>
          Modifică
        </button>
      </div>
    );
  }

  return (
    <div className="gemeni-selector">
      <h3 className="gemeni-title">Gemeni</h3>

      {pairs.length === 0 && (
        <p className="gemeni-hint">
          Există gemeni în această grupă? Adăugați perechile sau confirmați că nu există.
        </p>
      )}

      {pairs.map((pair, idx) => (
        <div key={pair.id} className="pair-row">
          <span className="pair-label">Pereche {idx + 1}</span>
          <select
            className="pair-select"
            value={pair.s1}
            onChange={(e) => updatePair(pair.id, "s1", e.target.value)}
          >
            <option value="">— Geamăn 1 —</option>
            {sorted.map((s) => (
              <option key={s.cnp} value={s.cnp}>
                {s.nume} {s.prenume1}
              </option>
            ))}
          </select>
          <select
            className="pair-select"
            value={pair.s2}
            onChange={(e) => updatePair(pair.id, "s2", e.target.value)}
          >
            <option value="">— Geamăn 2 —</option>
            {sorted.map((s) => (
              <option key={s.cnp} value={s.cnp}>
                {s.nume} {s.prenume1}
              </option>
            ))}
          </select>
          <button className="remove-pair-btn" onClick={() => removePair(pair.id)}>
            ✕
          </button>
        </div>
      ))}

      <div className="gemeni-actions">
        <button className="gs-button" onClick={addPair}>
          + Adaugă pereche
        </button>
        {allPairsValid && (
          <button className="gs-button" onClick={handleConfirm}>
            Confirmă gemenii
          </button>
        )}
        <button className="gs-button gs-button-secondary" onClick={handleNoTwins}>
          Nu există gemeni
        </button>
      </div>
    </div>
  );
}

GemeniSelector.propTypes = {
  allStudents: PropTypes.array.isRequired,
  onConfirm:   PropTypes.func.isRequired,
};

export default GemeniSelector;
