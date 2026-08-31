import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import {
  parseSIIIR,
  getReferenceYear,
  categorizeStudent,
  listaDinCNP,
} from "./siiirParser";
import "./FileUploader.css";

function FileUploader({ onFileUpload, onReset }) {
  const { state } = useAuth();
  const refYear   = useMemo(getReferenceYear, []);
  const anScolar  = `${refYear + 6}-${refYear + 7}`;

  const [mainLoaded,  setMainLoaded]  = useState(false);
  const [summary,     setSummary]     = useState(null);
  const [lmL1Loaded,  setLmL1Loaded]  = useState(false);
  const [lmL2Loaded,  setLmL2Loaded]  = useState(false);
  const [warnings,    setWarnings]    = useState("");
  const [isLoading,   setIsLoading]   = useState(false);
  const [totalElevi,  setTotalElevi]  = useState(0);

  const handleMainFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const { students, invalide, duplicate, hasListaColumn } = await parseSIIIR(file);

      const buckets = {
        lista1_fete:   [],
        lista1_baieti: [],
        lista2_fete:   [],
        lista2_baieti: [],
        ces:           [],
      };
      const skipped   = [];
      const diferente = [];

      for (const s of students) {
        const cat = categorizeStudent(s, refYear);
        if (cat) buckets[cat].push(s);
        else     skipped.push(s);

        // Lista din fișier diferă de cea rezultată din data nașterii (CES nu se compară)
        const calculata = listaDinCNP(s.cnp, refYear);
        if (s.lista && s.lista !== "CES" && calculata && s.lista !== calculata) diferente.push(s);
      }

      Object.entries(buckets).forEach(([cat, list]) => onFileUpload(list, cat));

      setSummary({
        ...Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])),
        total: students.length,
        sursaLista: hasListaColumn ? "coloana «Lista» din fișier" : "data nașterii din CNP",
      });
      setTotalElevi(students.length);
      setMainLoaded(true);

      const mesaje = [];
      if (invalide  > 0) mesaje.push(`${invalide} rânduri ignorate (CNP lipsă sau invalid).`);
      if (duplicate > 0) mesaje.push(`${duplicate} CNP-uri duplicate eliminate.`);
      if (skipped.length > 0) mesaje.push(`${skipped.length} elevi nerepartizabili (an naștere neașteptat).`);
      if (diferente.length > 0)
        mesaje.push(
          `${diferente.length} elevi au în fișier o listă diferită de cea rezultată din CNP ` +
          `(${diferente.map((s) => `${s.nume} ${s.prenume1}`).join(", ")}) — s-a folosit lista din fișier.`
        );
      setWarnings(mesaje.join(" "));
    } catch (err) {
      setWarnings(
        err && err.message
          ? `Eroare la citire: ${err.message}`
          : "Eroare la citire. Verificați că fișierul este exportul SIIIR în format .xlsx."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimbaMatFile = async (e, lista) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const category = lista === 1 ? "lista1_limbamat" : "lista2_limbamat";
    try {
      const { students } = await parseSIIIR(file);
      onFileUpload(students, category);
      lista === 1 ? setLmL1Loaded(true) : setLmL2Loaded(true);
      setTotalElevi((prev) => prev + students.length);
      setWarnings("");
    } catch (err) {
      setWarnings(
        err && err.message
          ? `Eroare la citirea fișierului limbă maternă: ${err.message}`
          : "Eroare la citirea fișierului limbă maternă."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMainLoaded(false);
    setSummary(null);
    setLmL1Loaded(false);
    setLmL2Loaded(false);
    setWarnings("");
    setTotalElevi(0);
    onReset();
  };

  return (
    <div className="FileUploader">
      {state.isAuthenticated ? (
        <>
          <p className="an-scolar-info">
            An școlar: <strong>{anScolar}</strong> — referință naștere: <strong>{refYear}</strong>
          </p>

          {/* Fișier principal SIIIR */}
          <div className="upload-section">
            <h3 className="upload-section-title">Fișier SIIIR — toți elevii</h3>
            <label className={`FileUploader-label ${mainLoaded ? "uploaded" : ""}`}>
              {mainLoaded ? "Fișier SIIIR încărcat ✓" : "Încarcă fișierul SIIIR (.xlsx)"}
              <input type="file" accept=".xlsx" onChange={handleMainFile} disabled={mainLoaded} />
            </label>

            {summary && (
              <div className="summary-box">
                <p><strong>Lista 1</strong> (până la 31 aug {refYear + 6}):</p>
                <ul>
                  <li>Fete: <strong>{summary.lista1_fete}</strong></li>
                  <li>Băieți: <strong>{summary.lista1_baieti}</strong></li>
                </ul>
                <p><strong>Lista 2</strong> (1 sep – 31 dec {refYear + 6}):</p>
                <ul>
                  <li>Fete: <strong>{summary.lista2_fete}</strong></li>
                  <li>Băieți: <strong>{summary.lista2_baieti}</strong></li>
                </ul>
                <p>Total: <strong>{summary.total}</strong> elevi</p>
                {summary.ces > 0 && (
                  <p className="ces-info">
                    Din care <strong>{summary.ces}</strong> cu CES — excluși din repartizarea
                    automată, se repartizează manual.
                  </p>
                )}
                <p className="sursa-lista">Împărțire pe liste după: {summary.sursaLista}</p>
              </div>
            )}
          </div>

          {/* Limbă maternă — opțional, apare după ce fișierul principal e încărcat */}
          {mainLoaded && (
            <div className="upload-section">
              <h3 className="upload-section-title">Elevi cu limbă maternă diferită (opțional)</h3>
              <label className={`FileUploader-label ${lmL1Loaded ? "uploaded" : ""}`}>
                {lmL1Loaded ? "Lista 1 Limbă maternă ✓" : "Lista 1 – Limbă maternă"}
                <input type="file" accept=".xlsx" onChange={(e) => handleLimbaMatFile(e, 1)} disabled={lmL1Loaded} />
              </label>
              <label className={`FileUploader-label ${lmL2Loaded ? "uploaded" : ""}`}>
                {lmL2Loaded ? "Lista 2 Limbă maternă ✓" : "Lista 2 – Limbă maternă"}
                <input type="file" accept=".xlsx" onChange={(e) => handleLimbaMatFile(e, 2)} disabled={lmL2Loaded} />
              </label>
            </div>
          )}

          {warnings  && <p className="warning">{warnings}</p>}
          {isLoading && <p>Se procesează...</p>}

          {totalElevi > 0 && (
            <p className="total-elevi-incarcati">Total elevi încărcați: <strong>{totalElevi}</strong></p>
          )}

          <button className="reset-button" onClick={handleReset}>Resetează</button>
        </>
      ) : (
        <p className="paragraph-file-uploder">
          Vă invităm să vă autentificați pentru a accesa funcționalitățile.
        </p>
      )}
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  onReset:      PropTypes.func.isRequired,
};

export default FileUploader;
