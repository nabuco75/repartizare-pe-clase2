import React, { useState } from "react";
import RepartizareElevi from "./RepartizareElevi";
import GeneratePDFButton from "./GeneratePDFButton";
import FileUploader from "./FileUploader";

function Landing() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  return (
    <div>
      <h2>Repartizarea elevilor pe clase</h2>
      <FileUploader onFileUpload={handleFileUpload} />

      {/* Adăugăm componenta pentru repartizarea elevilor */}
      <RepartizareElevi file={file} />

      {/* Adăugăm componenta pentru generarea PDF-ului */}
      <GeneratePDFButton />
    </div>
  );
}

export default Landing;
