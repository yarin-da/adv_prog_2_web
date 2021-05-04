import {useState} from "react";
import CsvDropzone from "./components/CsvDropzone";
import DataTable from "./components/DataTable";
import LineChart from "./components/LineChart";
import SelectList from "./components/SelectList";
import ServerTester from "./components/ServerTester";
import AirPlaneIcon from "./resources/airplane_icon.png";

// main app
const App = () => {
  //const [models, setModels] = useState([]);
  //const [anomalies, setAnomalies] = useState([]);
  
  // live flight data to detect anomalies
  const [detectData, setDetectData] = useState([]);
  // training data 
  const [trainData, setTrainData] = useState([]);
  // updates the data once everything has been parsed to json
  const onTrainDataChanged = (jsonData) => {
    setTrainData(jsonData);
  };
  const onDetectDataChanged = (jsonData) => {
    setDetectData(jsonData);
  }
  
  return (
    <div className="MainPage">
      <div className="SidePanel">
        <div className="IconArea">
          <div className="Icon">
            <img src={AirPlaneIcon} alt="airplane" width="100%" />
          </div>
        </div>
        <SelectList />
        <ServerTester />
        <CsvDropzone 
          onDataChanged={onDetectDataChanged}
          text="Drop a flight data file" />
        <CsvDropzone 
          onDataChanged={onTrainDataChanged}
          text="Drop a training data file" />
      </div>
      <div className="Divider" />
      <div className="DataPanel">
        <LineChart data={detectData} />
        <DataTable data={detectData} />
      </div>
    </div>
  );
}

export default App;
