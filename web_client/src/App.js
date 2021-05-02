import CsvDropzone from "./CsvDropzone";
import DataTable from "./DataTable";
import {useState} from "react";
import LineChart from "./LineChart";

// main app
const App = () => {
  // TODO: change this! <-- currently works for single csv file uploaded
  // stores the json data of the last csv file that was uploaded
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  // updates the data once everything has been parsed to json
  const onDataChanged = (jsonData) => {
    setData(jsonData);
    setHeaders(Object.keys(jsonData[0]));
  };

  return (
    <div className="MainPage">
      <div className="SidePanel">
        <CsvDropzone 
          onDataChanged={onDataChanged}
          text="Drop a training data file" />
        <CsvDropzone 
          onDataChanged={onDataChanged}
          text="Drop a flight data file" />
      </div>
      <div className="DataPanel">
        <LineChart headers={headers} data={data} />
        <DataTable headers={headers} data={data} />
      </div>
    </div>
  );
}

export default App;
