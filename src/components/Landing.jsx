import React, { useState } from "react";
import RepartizareElevi from "./RepartizareElevi";
import FileUploader from "./FileUploader";
import GenerateExcel from "./GenerateExcel";
import { useAuth } from "./AuthContext"; // Importul useAuth din Context API

function Landing() {
  const [file, setFile] = useState(null);
  const { state } = useAuth(); // Utilizarea useAuth pentru a accesa starea autentificării

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} />

      {/* Adăugăm componenta pentru repartizarea elevilor */}
      <RepartizareElevi file={file} />

      {/* Adăugăm componenta pentru generarea Excel-ului, doar pentru utilizatorii autentificați */}
      {state.isAuthenticated && <GenerateExcel />}
    </div>
  );
}

export default Landing;
