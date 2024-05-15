import React, { useState } from "react";
import FileUploader from "./FileUploader";
import RepartizareElevi from "./RepartizareElevi";

const ParentComponent = () => {
  const [dataBeforeSept, setDataBeforeSept] = useState([]);
  const [dataAfterSept, setDataAfterSept] = useState([]);
  const [finalClasses, setFinalClasses] = useState([]);

  const handleFileUpload = (data, category) => {
    if (category === "before") {
      setDataBeforeSept(data);
    } else if (category === "after") {
      setDataAfterSept(data);
    }
  };

  const handleClassesChange = (classes) => {
    setFinalClasses(classes);
  };

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} />
      <RepartizareElevi dataBeforeSept={dataBeforeSept} dataAfterSept={dataAfterSept} onClaseChange={handleClassesChange} />
      {finalClasses.length > 0 && (
        <div>
          <h2>Clase finale repartizate:</h2>
          {finalClasses.map((clasa, index) => (
            <div key={index}>
              <h3>Clasa {index + 1}:</h3>
              <ul>
                {clasa.map((student, idx) => (
                  <li key={idx}>
                    {student.nume} ({student.gen})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
