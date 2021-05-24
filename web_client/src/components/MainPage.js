import DataTable from './DataTable';
import ModelList from './ModelList';
import AnomalyList from './AnomalyList';
import CsvDropzone from './CsvDropzone';
import Graph from './Graph';
import Button from '@material-ui/core/Button';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

// override default colors
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

// grab all states from the main component via props
const MainPage = ({
  models,
  selectedModel, setSelectedModel,
  anomalies,
  detectData, setDetectData,
  setTrainData,
  modelType, setModelType,
  graphUpdates,
  selectedAnomalyPair, setSelectedAnomalyPair,
  deleteModel,
}) => {
  
  // draw the whole main page
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

export default MainPage;
