import React, { useState, useMemo } from "react";
import FileUploader from "./FileUploader";
import GemeniSelector from "./GemeniSelector";
import RepartizareElevi from "./RepartizareElevi";

const emptyLista1 = () => ({ fete: [], baieti: [], limbaMat: [] });
const emptyLista2 = () => ({ fete: [], baieti: [], limbaMat: [] });

const ParentComponent = () => {
  const [lista1, setLista1] = useState(emptyLista1());
  const [lista2, setLista2] = useState(emptyLista2());
  const [gemeniPairs, setGemeniPairs] = useState(null);
  const [ces, setCes] = useState([]);

  const allStudents = useMemo(() => [
    ...lista1.fete, ...lista1.baieti, ...lista1.limbaMat,
    ...lista2.fete, ...lista2.baieti, ...lista2.limbaMat,
  ], [lista1, lista2]);

  const handleFileUpload = (data, category) => {
    switch (category) {
      case "lista1_fete":     setLista1((p) => ({ ...p, fete:    [...p.fete,    ...data] })); break;
      case "lista1_baieti":   setLista1((p) => ({ ...p, baieti:  [...p.baieti,  ...data] })); break;
      case "lista1_limbamat": setLista1((p) => ({ ...p, limbaMat:[...p.limbaMat,...data] })); break;
      case "lista2_fete":     setLista2((p) => ({ ...p, fete:    [...p.fete,    ...data] })); break;
      case "lista2_baieti":   setLista2((p) => ({ ...p, baieti:  [...p.baieti,  ...data] })); break;
      case "lista2_limbamat": setLista2((p) => ({ ...p, limbaMat:[...p.limbaMat,...data] })); break;
      case "ces":             setCes((p) => [...p, ...data]); break;
      default: break;
    }
  };

  const handleReset = () => {
    setLista1(emptyLista1());
    setLista2(emptyLista2());
    setGemeniPairs(null);
    setCes([]);
  };

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} onReset={handleReset} />
      {allStudents.length > 0 && (
        <GemeniSelector allStudents={allStudents} onConfirm={setGemeniPairs} />
      )}
      <RepartizareElevi
        lista1={lista1}
        lista2={lista2}
        ces={ces}
        gemeniPairs={gemeniPairs}
        onClaseChange={() => {}}
      />
    </div>
  );
};

export default ParentComponent;
