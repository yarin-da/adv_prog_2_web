import {useState} from "react";
import FileDropzone from "./FileDropzone";

function App() {
  const csvType = ".csv, application/vnd.ms-excel, text/csv";
  const [trainingFilePath, setTrainingFilePath] = useState("Missing training file");
  const [dataFilePath, setDataFilePath] = useState("Missing data file");

  const onTrainingFileChosen = (path) => {
    setTrainingFilePath(path);
  }

  const onDataFileChosen = (path) => {
    setDataFilePath(path);
  }

  return (
    <>
      <div className="SidePanel">
        <header className="Title">Model Load Panel</header>
        <FileDropzone 
          text="Drop a training data file" 
          type={csvType} 
          onFileChosen={onTrainingFileChosen}/>
        <FileDropzone 
          text="Drop a flight data file" 
          type={csvType}
          onFileChosen={onDataFileChosen} />
      </div>
      <div className="GraphPanel">
        <header className="Title">Graph Panel</header>
      </div>
      <div className="TablePanel">
        <header className="Title">Table Panel</header>
      </div>
    </>
  );
}

export default App;
