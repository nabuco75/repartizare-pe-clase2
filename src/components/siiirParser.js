import * as XLSX from "xlsx";

// Citirea exportului SIIIR: identificare antet, mapare coloane, normalizare elevi.

// Normalizează un text de antet: fără diacritice, litere mici, fără spații multiple
const normalizeHeader = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// Păstrează doar cifrele dintr-un CNP (exportul SIIIR poate conține spații/apostrof)
const cleanCNP = (value) => String(value ?? "").replace(/\D/g, "");

const isValidCNP = (value) => cleanCNP(value).length === 13;

// Din CNP extrage anul și luna nașterii
// Cifra 1: 1/2=1900s, 3/4=1800s, 5/6=2000s
export const parseCNP = (cnp) => {
  const s = cleanCNP(cnp).padStart(13, "0");
  const d = parseInt(s[0]);
  const century = d <= 2 ? 1900 : d <= 4 ? 1800 : 2000;
  return {
    year:  century + parseInt(s.substring(1, 3)),
    month: parseInt(s.substring(3, 5)),
  };
};

// Genul din CNP: prima cifră impară = masculin, pară = feminin
const genFromCNP = (cnp) => {
  const d = parseInt(cleanCNP(cnp)[0]);
  if (!d) return "";
  return d % 2 === 1 ? "M" : "F";
};

// Acceptă "F", "f", "Feminin", "M", "Masculin", "B" (băiat) etc.
const normalizeGen = (value, cnp) => {
  const v = normalizeHeader(value);
  if (v.startsWith("f")) return "F";
  if (v.startsWith("m") || v.startsWith("b")) return "M";
  return genFromCNP(cnp);
};

// "LISTA 1" / "Lista2" / "1" -> "1";  "CES" -> "CES";  gol -> null (se decide după CNP)
const normalizeLista = (value) => {
  const v = normalizeHeader(value);
  if (/\bces\b/.test(v)) return "CES";
  if (/(^|\D)1(\D|$)/.test(v) && v.includes("lista")) return "1";
  if (/(^|\D)2(\D|$)/.test(v) && v.includes("lista")) return "2";
  if (v === "1") return "1";
  if (v === "2") return "2";
  return null;
};

// Anul de naștere de referință pentru înscrierea în clasa pregătitoare:
// dacă suntem înainte de septembrie → an curent - 6, altfel an următor - 6
export const getReferenceYear = () => {
  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();
  return (month < 9 ? year : year + 1) - 6;
};

export const categorizeStudent = (student, refYear) => {
  // Elevii CES nu intră în repartizarea automată — se repartizează manual
  if (student.lista === "CES") return "ces";

  const grup = student.gen === "F" ? "fete" : "baieti";

  // Dacă exportul are deja coloana "Lista", ea este cea oficială
  if (student.lista) return `lista${student.lista}_${grup}`;

  const { year, month } = parseCNP(student.cnp);
  if (!year || !month) return null;
  if (year < refYear)                  return `lista1_${grup}`;
  if (year === refYear && month <= 8)  return `lista1_${grup}`;
  if (year === refYear && month >  8)  return `lista2_${grup}`;
  return null;
};

// Lista calculată strict după data nașterii — folosită doar pentru avertizări
export const listaDinCNP = (cnp, refYear) => {
  const { year, month } = parseCNP(cnp);
  if (!year || !month) return null;
  if (year < refYear || (year === refYear && month <= 8)) return "1";
  if (year === refYear && month > 8) return "2";
  return null;
};

// Găsește rândul de antet (exportul SIIIR are titlu, dată și rânduri goale deasupra)
const findHeaderRow = (rows) => {
  const limit = Math.min(rows.length, 30);
  for (let i = 0; i < limit; i++) {
    const cells = (rows[i] || []).map(normalizeHeader);
    const hasCNP  = cells.some((c) => c.includes("cnp"));
    const hasName = cells.some((c) => c.startsWith("nume") || c.startsWith("prenume"));
    if (hasCNP && hasName) return i;
  }
  return -1;
};

// Mapează antetul la indici de coloană, indiferent de ordinea din fișier
const mapColumns = (headerCells) => {
  const map = { cnp: -1, gen: -1, nume: -1, initiala: -1, prenume: [], lista: -1 };

  headerCells.forEach((raw, idx) => {
    const h = normalizeHeader(raw);
    if (!h) return;
    if (map.cnp      === -1 && h.includes("cnp"))                             map.cnp = idx;
    else if (map.gen === -1 && (h.startsWith("sex") || h.startsWith("gen")))  map.gen = idx;
    else if (map.initiala === -1 && h.startsWith("init"))                     map.initiala = idx;
    else if (h.startsWith("prenume"))                                         map.prenume.push(idx);
    else if (map.nume === -1 && h.startsWith("nume"))                         map.nume = idx;
    else if (map.lista === -1 && h === "lista")                               map.lista = idx;
  });

  return map;
};

// Ordinea veche, pozițională: CNP | Nume | Init.tata | Prenume | Prenume2 | Prenume3 | Gen
const LEGACY_COLUMNS = { cnp: 0, nume: 1, initiala: 2, prenume: [3, 4, 5], gen: 6, lista: -1 };

const cell = (row, idx) => (idx >= 0 && row[idx] != null ? String(row[idx]).trim() : "");

const rowToStudent = (row, cols) => {
  const cnp = cleanCNP(row[cols.cnp]);

  // Un singur câmp "Prenume" poate conține mai multe prenume separate prin spațiu
  const prenume = cols.prenume
    .map((i) => cell(row, i))
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);

  return {
    cnp,
    nume:     cell(row, cols.nume),
    initiala: cell(row, cols.initiala),
    prenume1: prenume[0] || "",
    prenume2: prenume[1] || "",
    prenume3: prenume.slice(2).join(" "),
    gen:      normalizeGen(cell(row, cols.gen), cnp),
    lista:    normalizeLista(cell(row, cols.lista)),
  };
};

// Transformă rândurile brute ale foii (array de array-uri) în elevi
export const parseSheetRows = (rows) => {
  const headerIdx = findHeaderRow(rows);
  const cols      = headerIdx === -1 ? LEGACY_COLUMNS : mapColumns(rows[headerIdx]);
  const dataRows  = headerIdx === -1 ? rows.slice(1) : rows.slice(headerIdx + 1);

  if (cols.cnp === -1 || (cols.nume === -1 && cols.prenume.length === 0)) {
    throw new Error("Nu am găsit coloanele CNP / Nume în fișier.");
  }

  const students = [];
  const seen     = new Set();
  let invalide   = 0;
  let duplicate  = 0;

  for (const row of dataRows) {
    if (!row || !row.some((c) => String(c).trim() !== "")) continue;
    if (!isValidCNP(row[cols.cnp])) { invalide++; continue; }

    const student = rowToStudent(row, cols);
    if (seen.has(student.cnp)) { duplicate++; continue; }
    seen.add(student.cnp);
    students.push(student);
  }

  if (students.length === 0) {
    throw new Error("Nu am găsit niciun elev cu CNP valid. Verificați că fișierul este exportul SIIIR.");
  }

  return { students, invalide, duplicate, hasListaColumn: cols.lista !== -1 };
};

// Parsare fișier SIIIR — coloanele sunt identificate după antet, nu după poziție
export const parseSIIIR = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data     = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const rows     = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
        resolve(parseSheetRows(rows));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
