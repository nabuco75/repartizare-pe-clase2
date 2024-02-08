import React, { useState, useEffect } from "react";
import RepartizareElevi from "./RepartizareElevi";
import FileUploader from "./FileUploader";
import GenerateExcel from "./GenerateExcel";
import { useAuth } from "./AuthContext";

function Landing() {
  const [uploadedData, setUploadedData] = useState(null);
  const [clase, setClase] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Noua stare pentru a urmări dacă datele au fost încărcate

  const { state } = useAuth();

  const handleFileUpload = (uploadedData) => {
    setUploadedData(uploadedData);
  };

  const handleClaseChange = (claseRepartizate) => {
    setClase(claseRepartizate);
  };

  useEffect(() => {
    // Verificăm dacă datele au fost încărcate
    if (uploadedData && uploadedData.length > 0) {
      setDataLoaded(true); // Setăm dataLoaded pe true dacă există date încărcate
    } else {
      setDataLoaded(false); // Setăm dataLoaded pe false dacă nu există date încărcate
    }
  }, [uploadedData]);

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} />

      {dataLoaded && ( // Verificăm dacă datele sunt încărcate înainte de a afișa componenta RepartizareElevi
        <RepartizareElevi data={uploadedData} onClaseChange={handleClaseChange} />
      )}

      {/* Adăugăm componenta pentru generarea Excel-ului, doar pentru utilizatorii autentificați și dacă există date încărcate */}
      {state.isAuthenticated && dataLoaded && <GenerateExcel data={clase} />}
    </div>
  );
}

export default Landing;
