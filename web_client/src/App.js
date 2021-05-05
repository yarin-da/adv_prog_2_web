import {useCallback, useState} from "react";
import DataTable from "./components/DataTable";
import LineChart from "./components/LineChart";
import SelectList from "./components/SelectList";
import AnomalyList from "./components/AnomalyList";
import ServerHandler from "./components/ServerHandler";
import UserDataHandler from "./components/UserDataHandler";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import AirPlaneIcon from "./resources/airplane_icon.png";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

/* TODO: remove demo data after server is up and running */
const demoModels = [
  {
    model_id: 0,
    upload_time: "2021-04-22T19:15:32+02.00",
    status: "ready",
  },
  {
    model_id: 1,
    upload_time: "2021-04-21T18:17:32+02.00",
    status: "pending",
  },
  {
    model_id: 2,
    upload_time: "2021-04-25T21:15:32+02.00",
    status: "ready",
  },
  {
    model_id: 3,
    upload_time: "2021-04-30T19:07:32+02.00",
    status: "pending",
  },
  {
    model_id: 4,
    upload_time: "2021-05-04T09:15:32+02.00",
    status: "pending",
  },
]

const demoAnomalies = {
  anomalies: {
    'pitch-deg': [[0,1],[4,5]],
    'longitude-deg': [[0,2]],
    'indicated-heading-deg': [[104,107]],
  },
  reason: {
    'pitch-deg': 'airspeed-kt',
    'longitude-deg': 'altimeter_indicated-altitude-ft',
    'indicated-heading-deg': 'attitude-indicator_indicated-pitch-deg',
  }
};

// main app
const App = () => {
  const [models, setModels] = useState(demoModels);
  const [selectedModel, setSelectedModel] = useState(-1); // selected model id
  
  const [anomalies, setAnomalies] = useState(demoAnomalies);
  const [selectedAnomalyPair, setSelectedAnomalyPair] = useState([]);

  const [detectData, setDetectData] = useState([]); // flight data to test for anomalies
  const [trainData, setTrainData] = useState([]); // training data 
  const [modelType, setModelType] = useState("regression"); // user's desired model type

  const onModelSelected = (model_id) => {
    setSelectedModel(model_id);
  }
  const onAnomalyPairSelected = (pair) => {
    setSelectedAnomalyPair(pair);
  }
  const deleteModel = (id) => {
    setModels(models.filter((model) => model.model_id !== id));
  }
  const onTrainDataChanged = (jsonData) => {
    setTrainData(jsonData);
  };
  const onDetectDataChanged = (jsonData) => {
    setDetectData(jsonData);
  };
  const onModelTypeChanged = (type) => {
    setModelType(type);
  };

  const sendModelToServer = useCallback(() => {
    // make sure all the data required has been initialized
    if (modelType === -1 || trainData === []) { return; }
    // send request to the server
    ServerHandler.postModel(modelType, (jsonData) => {
      const modelResponse = jsonData;
      console.log(`POST /api/model response: ${modelResponse}`);
    });
  }, [trainData]);

  const getAnomaliesFromServer = useCallback(() => {
    // make sure all the data required has been initialized
    if (modelType === -1 || detectData === []) { return; }
    // send request to the server
    ServerHandler.postAnomalies(modelType, detectData, (jsonData) => {
      const anomaliesResponse = jsonData;
      console.log(`POST /api/anomaly response: ${anomaliesResponse}`);
    });
  }, [selectedModel, detectData]);

  return (
    <ThemeProvider theme={theme}>
      <div className="MainPage">
        <div>
          <div className="IconArea">
            <div className="Icon">
              <img src={AirPlaneIcon} alt="airplane" width="100%" />
            </div>
          </div>
          <SelectList 
            models={models}
            selectedModel={selectedModel}
            onModelSelected={onModelSelected}
            onDeleteItem={deleteModel} />
          <AnomalyList 
            anomalies={anomalies}
            selectedAnomalyPair={selectedAnomalyPair}
            onAnomalyPairSelected={onAnomalyPairSelected} />
          <UserDataHandler 
            modelType={modelType}
            onModelTypeChanged={onModelTypeChanged}
            onDetectDataChanged={onDetectDataChanged} 
            onTrainDataChanged={onTrainDataChanged} />
        </div>
        <div className="Divider" />
        <div className="DataPanel">
          <LineChart 
            data={detectData} 
            columnFilter={selectedAnomalyPair} />
          <DataTable data={detectData} anomalies={anomalies} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
