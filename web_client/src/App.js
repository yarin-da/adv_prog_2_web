import {useEffect, useCallback, useState, useRef} from 'react';
import HttpRequestHandler from './components/HttpRequestHandler';
import DataTable from './components/DataTable';
import ModelList from './components/ModelList';
import AnomalyList from './components/AnomalyList';
import CsvDropzone from './components/CsvDropzone';
import Graph from './components/Graph';
import Button from '@material-ui/core/Button';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      light: '#4fb3bf',
      main: '#00838f',
      dark: '#005662',
      textPrimary: '#ffffff',
    },
    primary: {
      light: '#324053',
      main: '#0a1a2a',
      dark: '#000000',
      textPrimary: '#ffffff',
    },
    text: {
      main: '#ffffff',
      primary: '#ffffff',
      secondary: '#9a9a9a',
      disabled: '#6c6c6c'
    },
  }
});

const App = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null); // selected model id
  const [anomalies, setAnomalies] = useState(null);
  const [detectData, setDetectData] = useState([]); // flight data to test for anomalies
  const [trainData, setTrainData] = useState([]); // training data 
  const [modelType, setModelType] = useState('regression'); // user's desired model type
  const [graphUpdates, setGraphUpdates] = useState(0);
  const [selectedAnomalyPair, setSelectedAnomalyPair] = useState([]);
  const modelsRef = useRef();
  modelsRef.current = models;
  
  const deleteModel = (id) => {
    HttpRequestHandler.deleteModel(id);
    setModels(models.filter((model) => model.model_id !== id));
  };
  
  const updateModels = useCallback(
    () => {
      function shouldUpdate(a, b) {
        return a.length !== b.length ||
        !a.every((val, i) => Object.keys(val).every(col => val[col] === b[i][col]));
      }
      HttpRequestHandler.getModels(
        (jsonData) => {
          if (shouldUpdate(jsonData, modelsRef.current)) {
            setModels(oldState => jsonData);
          } 
        }
      );
    },
    []
  );

  useEffect(
    () => {
      const updateDelay = 1000;
      const interval = setInterval( 
        () => updateModels(), 
        updateDelay
      );
      updateModels();
      return () => clearInterval(interval);  
    }, 
    [updateModels]
  );
  
  useEffect(
    () => {
      // make sure all the data required has been initialized
      if (trainData == null || trainData.length <= 0) { return; }
      // send request to the server
      HttpRequestHandler.postModel(modelType, trainData, (jsonData) => {
        setTrainData([]);
      });
    }, 
    [trainData, modelType]
  );

  useEffect(
    () => {
      if (selectedModel == null) { return; }
      const model = models.find(
        model => model.model_id === selectedModel.model_id
      );
      if (model == null) {
        setSelectedModel(null);
      }
    },
    [models]
  );

  useEffect(() => {
    // make sure all the data required has been initialized
    if (detectData.length <= 0 || selectedModel == null || selectedModel.status !== 'ready') { 
      return; 
    }
    // send request to the server
    HttpRequestHandler.postAnomalies(selectedModel.model_id, detectData, (jsonData) => {
      setAnomalies(jsonData);
    });
  }, [detectData, selectedModel]);

  useEffect(() => {
    setGraphUpdates(updates => updates + 1);
  }, [anomalies, selectedAnomalyPair]);

  return (
    <ThemeProvider theme={theme}>
      <div className='MainPage'>
        <div>
          <div style={{margin: 10, border: 'solid 2px #324053', borderRadius: 4}}>
            <AnomalyList 
              anomalies={anomalies}
              selectedAnomalyPair={selectedAnomalyPair}
              onAnomalyPairSelected={setSelectedAnomalyPair} 
            />
            <CsvDropzone 
              onDataChanged={setDetectData}
              text='Drop a flight data file' 
            />
          </div>
          <div style={{margin: 10, border: 'solid 2px #324053', borderRadius: 4}}>
            <ModelList 
              models={models}
              selectedModel={selectedModel}
              onModelSelected={setSelectedModel}
              onDeleteItem={deleteModel}
            />
            <CsvDropzone 
              onDataChanged={setTrainData}
              text='Drop a training data file'
            />
            <div style={{margin: 2}}>
              <Button
                fullWidth
                color='secondary'
                variant={modelType === 'regression' ? 'contained' : 'outlined'}
                onClick={() => setModelType('regression')}
              >
                Regression
              </Button>
              <Button
                fullWidth
                color='secondary'
                variant={modelType === 'hybrid' ? 'contained' : 'outlined'}
                onClick={() => setModelType('hybrid')}
              >
                Hybrid
              </Button>
            </div>
          </div>
        </div>
        <div className='DataPanel'>
          <>
            <Graph 
              data={detectData} 
              anomalyPair={selectedAnomalyPair}
              anomalies={anomalies} 
              graphUpdates={graphUpdates}
            />
            <DataTable 
              data={detectData}
              anomalyPair={selectedAnomalyPair}
              anomalies={anomalies} 
            />
          </> 
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
