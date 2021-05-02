import CsvDropzone from "./CsvDropzone";
import DataTable from "./DataTable";
import {useState} from "react";

// main app
const App = () => {
  // TODO: change this! <-- currently works for single csv file uploaded
  // stores the json data of the last csv file that was uploaded
  const [data, setData] = useState([]);
  // updates the data once everything has been parsed to json
  const onDataChanged = (jsonData) => {
    setData(jsonData);
  };

  return (
    <div className="MainPage">
      <div className="SidePanel">
        <header className="Title">Model Load Panel</header>
        <CsvDropzone 
          onDataChanged={onDataChanged}
          text="Drop a training data file" />
        <CsvDropzone 
          onDataChanged={onDataChanged}
          text="Drop a flight data file" />
      </div>
      <div>
        <div className="GraphPanel">
          <header className="Title">Graph Panel</header>
        </div>
        <div className="TablePanel">
          <DataTable 
            data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
