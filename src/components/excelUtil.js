import * as XLSX from "xlsx";

export const generateExcelForClasses = (claseRepartizate) => {
  claseRepartizate.forEach((clasa, index) => {
    const classData = clasa.map((elev) => ({
      Nume: elev.nume,
    }));
    const worksheet = XLSX.utils.json_to_sheet(classData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Clasa ${index + 1}`);

    XLSX.writeFile(workbook, `Clasa_${index + 1}.xlsx`);
  });
};
