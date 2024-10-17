import React, { useState } from "react";
import FileUploader from "./FileUploader";
import RepartizareElevi from "./RepartizareElevi";

const ParentComponent = () => {
  // State pentru elevii încărcați înainte și după septembrie
  const [dataBeforeSept, setDataBeforeSept] = useState([]);
  const [dataAfterSept, setDataAfterSept] = useState([]);

  // Funcție care gestionează încărcarea fișierelor pe categorii
  const handleFileUpload = (data, category) => {
    // Verificăm categoria pentru a decide unde merg datele încărcate
    if (category === "lista1_fete" || category === "lista1_baieti") {
      setDataBeforeSept((prevData) => [...prevData, ...data]);
    } else if (category === "lista2_fete" || category === "lista2_baieti") {
      setDataAfterSept((prevData) => [...prevData, ...data]);
    }
  };

  // Funcție care gestionează schimbarea claselor repartizate
  const handleClassesChange = (finalClasses) => {
    console.log("Clasele finale repartizate:", finalClasses);
    // Aici poți gestiona clasele finale (salvare, API call, etc.)
  };

  return (
    <div>
      {/* Componenta de încărcare fișiere */}
      <FileUploader onFileUpload={handleFileUpload} />
      {/* Componenta de repartizare elevi */}
      <RepartizareElevi dataBeforeSept={dataBeforeSept} dataAfterSept={dataAfterSept} onClaseChange={handleClassesChange} />
    </div>
  );
};

export default ParentComponent;
