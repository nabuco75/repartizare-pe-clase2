import * as XLSX from "xlsx";

const toRow = (elev, idx) => ({
  "Nr. crt.": idx + 1,
  CNP:        elev.cnp || "",
  Nume:       elev.nume,
  Inițiala:   elev.initiala || "",
  Prenume:    [elev.prenume1, elev.prenume2, elev.prenume3].filter(Boolean).join(" "),
  Gen:        elev.gen || "",
});

export const generateExcelForClasses = (claseRepartizate, ces = []) => {
  const workbook = XLSX.utils.book_new();

  claseRepartizate.forEach((clasa, index) => {
    const worksheet = XLSX.utils.json_to_sheet(clasa.map(toRow));
    XLSX.utils.book_append_sheet(workbook, worksheet, `Clasa ${String.fromCharCode(65 + index)}`);
  });

  // Elevii CES nu sunt repartizați automat, dar trebuie să apară în export
  if (ces.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(ces.map(toRow));
    XLSX.utils.book_append_sheet(workbook, worksheet, "CES (nerepartizați)");
  }

  XLSX.writeFile(workbook, "Repartizare_Elevi.xlsx");
};
