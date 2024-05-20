import React, { useState } from "react";
import FileUploader from "./FileUploader";
import RepartizareElevi from "./RepartizareElevi";

const ParentComponent = () => {
  const [dataBeforeSept, setDataBeforeSept] = useState([]);
  const [dataAfterSept, setDataAfterSept] = useState([]);

  const handleFileUpload = (data, category) => {
    if (category === "before") {
      setDataBeforeSept(data);
    } else if (category === "after") {
      setDataAfterSept(data);
    }
  };

  const handleClassesChange = () => {};

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} />
      <RepartizareElevi dataBeforeSept={dataBeforeSept} dataAfterSept={dataAfterSept} onClaseChange={handleClassesChange} />
    </div>
  );
};

export default ParentComponent;
