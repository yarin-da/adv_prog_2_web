import {useCallback, useState} from 'react';
import DataTable from './components/DataTable';
import LineChart from './components/LineChart';
import SelectList from './components/SelectList';
import AnomalyList from './components/AnomalyList';
import ServerHandler from './components/ServerHandler';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import CsvDropzone from './components/CsvDropzone';
import { ThemeProvider, createMuiTheme, Typography } from '@material-ui/core';
import LocalAirportRoundedIcon from '@material-ui/icons/LocalAirportRounded';

// const theme = createMuiTheme({
//   palette: {
//     type: 'dark',
//   }
// })

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#324053',
      main: '#0a1a2a',
      dark: '#000000',
      textPrimary: '#ffffff',
    },
    secondary: {
      light: '#4fb3bf',
      main: '#00838f',
      dark: '#005662',
      textPrimary: '#ffffff',
    },
    text: {
      main: '#ffffff',
      primary: '#ffffff',
      secondary: '#9a9a9a',
      disabled: '#6c6c6c'
    },
    action: {
      active: '#fffffff',
      hover: '#141414',
      selected: '#282828',
      disabled: '#606060',
      disabledBackground: '#c0c0c0',
    },
  },
});

/* TODO: remove demo data after server is up and running */
const demoModels = [
  {
    model_id: 0,
    upload_time: '2021-04-22T19:15:32+02.00',
    status: 'ready',
  },
  {
    model_id: 1,
    upload_time: '2021-04-21T18:17:32+02.00',
    status: 'pending',
  },
  {
    model_id: 2,
    upload_time: '2021-04-25T21:15:32+02.00',
    status: 'ready',
  },
  {
    model_id: 3,
    upload_time: '2021-04-30T19:07:32+02.00',
    status: 'pending',
  },
  {
    model_id: 4,
    upload_time: '2021-05-04T09:15:32+02.00',
    status: 'pending',
  },
]

const demoAnomalies = {
  anomalies: {
    'pitch-deg': [[0,1],[22,87],[1150,1320]],
    'longitude-deg': [[55,200],[490,490],[1700,1950]],
    'indicated-heading-deg': [[104,257]],
  },
  reason: {
    'pitch-deg': 'airspeed-kt',
    'longitude-deg': 'altimeter_indicated-altitude-ft',
    'indicated-heading-deg': 'altimeter_pressure-alt-ft',
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
  const [modelType, setModelType] = useState('regression'); // user's desired model type

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
  }, [trainData, modelType]);

  const getAnomaliesFromServer = useCallback(() => {
    // make sure all the data required has been initialized
    if (selectedModel === -1 || detectData === []) { return; }
    // send request to the server
    ServerHandler.postAnomalies(selectedModel, detectData, (jsonData) => {
      const anomaliesResponse = jsonData;
      console.log(`POST /api/anomaly response: ${anomaliesResponse}`);
    });
  }, [detectData, selectedModel]);

  return (
    <ThemeProvider theme={theme}>
      <div className='MainPage'>
        <div style={{display: 'flex', flexDirection: 'column',}}>
          <div style={{
            display: 'flex',
            height: 50, 
            padding: 5,}}>
            <Icon style={{
              marginRight: 15,
              padding: 10,
              paddingBottom: 15,
              alignSelf: 'center',
              }}>
              <LocalAirportRoundedIcon style={{color: '#fff', fontSize: 'xx-large',}} />
            </Icon>
            <Typography
              color='textPrimary'
              variant='h5'
              style={{
                color: '#fff',
                fontWeight: 'bold', 
                alignSelf: 'center', 
                padding: 5}}>
              Anomaly Analyzer
            </Typography>
          </div>
          <div>
            <AnomalyList 
              anomalies={anomalies}
              selectedAnomalyPair={selectedAnomalyPair}
              onAnomalyPairSelected={onAnomalyPairSelected} />
            <CsvDropzone 
              onDataChanged={onDetectDataChanged}
              text='Drop a flight data file' />
          </div>
          <div>
            <SelectList 
              models={models}
              selectedModel={selectedModel}
              onModelSelected={onModelSelected}
              onDeleteItem={deleteModel} />
            <CsvDropzone 
              onDataChanged={onTrainDataChanged}
              text='Drop a training data file' />
            <Button
              fullWidth
              color='secondary'
              variant={modelType === 'regression' ? 'contained' : 'outlined'}
              onClick={() => onModelTypeChanged('regression')}>
                Regression
            </Button>
            <Button
              fullWidth
              color='secondary'
              variant={modelType === 'hybrid' ? 'contained' : 'outlined'}
              onClick={() => onModelTypeChanged('hybrid')}>
                Hybrid
            </Button>
          </div>
        </div>
        <div className='Divider' />
        <div className='DataPanel'>
          <LineChart 
            data={detectData} 
            anomalyPair={selectedAnomalyPair}
            anomalies={anomalies} />
          <DataTable 
            data={detectData}
            anomalyPair={selectedAnomalyPair}
            anomalies={anomalies} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
