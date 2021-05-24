import { useEffect, useCallback, useState, useRef } from 'react';
import HttpRequestHandler from './components/HttpRequestHandler';
import MainPage from './components/MainPage';

const App = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null); // selected model id
  const [anomalies, setAnomalies] = useState(null);
  const [detectData, setDetectData] = useState([]); // flight data to test for anomalies
  const [trainData, setTrainData] = useState([]); // training data 
  const [modelType, setModelType] = useState('regression'); // user's desired model type
  const [graphUpdates, setGraphUpdates] = useState(0);
  const [selectedAnomalyPair, setSelectedAnomalyPair] = useState([]);
  // used to avoid dependency on models state
  const modelsRef = useRef();
  modelsRef.current = models;
  
  const deleteModel = (id) => {
    // delete on server side
    HttpRequestHandler.deleteModel(id);
    // delete on client side for immediate feedback
    setModels(models.filter((model) => model.model_id !== id));
  };
  
  const updateModels = useCallback(
    () => {
      // a predicate
      function shouldUpdate(a, b) {
        return a.length !== b.length ||
        !a.every((val, i) => Object.keys(val).every(col => val[col] === b[i][col]));
      }
      // request all models from the server
      // update only when necessary
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

  // set a timer to update models every second
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
  
  // send a new model to the server
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

  // unselect a model if it has been deleted
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
    [models, selectedModel]
  );

  // get anomalies from the server
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

  // change graphUpdates to re-render the graph
  useEffect(() => {
    setGraphUpdates(updates => updates + 1);
  }, [anomalies, selectedAnomalyPair]);

  return (
    <MainPage 
      models={models}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      anomalies={anomalies}
      detectData={detectData}
      setDetectData={setDetectData}
      setTrainData={setTrainData}
      modelType={modelType}
      setModelType={setModelType}
      graphUpdates={graphUpdates}
      selectedAnomalyPair={selectedAnomalyPair}
      setSelectedAnomalyPair={setSelectedAnomalyPair}
      deleteModel={deleteModel}
    />
  );
};

export default App;
