import React from "react";
import { PDFDocument, rgb } from "pdf-lib";
import PropTypes from "prop-types";

function GeneratePDFButton({ clase }) {
  // Validați tipul prop-ului "clase" folosind PropTypes
  GeneratePDFButton.propTypes = {
    clase: PropTypes.array.isRequired, // Specificați tipul și că este obligatoriu
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Adăugăm conținutul PDF aici
    const content = page.drawText("Repartizarea elevilor:", {
      x: 50,
      y: page.getHeight() - 50,
      size: 30,
      color: rgb(0, 0, 0), // Culoarea textului (negru)
    });

    // Adăugăm datele despre repartizarea elevilor
    let yOffset = page.getHeight() - 100;
    for (const clasa of clase) {
      content.drawText(`Clasa:`, { x: 50, y: yOffset, size: 18, color: rgb(0, 0, 0) });
      yOffset -= 25;
      for (const elev of clasa) {
        content.drawText(`- ${elev.nume}`, { x: 70, y: yOffset, size: 14, color: rgb(0, 0, 0) });
        yOffset -= 20;
      }
      yOffset -= 10;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "repartizare_elevi.pdf";
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  return <button onClick={generatePDF}>Descarcă PDF</button>;
}

export default GeneratePDFButton;
