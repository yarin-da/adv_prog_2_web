import {useState} from 'react';
import DataTable from './DataTable';
import LineChart from './LineChart';
import SelectList from './SelectList';
import AnomalyList from './AnomalyList';
import Button from '@material-ui/core/Button';
import CsvDropzone from './CsvDropzone';
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

const MainPage = (props) => {
  const {
    models, modelType, 
    detectData, trainData, 
    anomalies,
    selectedModel,
    setModels, setModelType,
    setDetectData, setTrainData,
    setSelectedModel,
    deleteModel,
  } = props;

  const [selectedAnomalyPair, setSelectedAnomalyPair] = useState([]);

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
            <SelectList 
              models={models}
              selectedModel={selectedModel}
              onModelSelected={setSelectedModel}
              onDeleteItem={deleteModel} />
            <CsvDropzone 
              onDataChanged={setTrainData}
              text='Drop a training data file' />
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
          {detectData != null && detectData.length > 0 &&
            <>
              <LineChart 
                data={detectData} 
                anomalyPair={selectedAnomalyPair}
                anomalies={anomalies} 
              />
              <DataTable 
                data={detectData}
                anomalyPair={selectedAnomalyPair}
                anomalies={anomalies} 
              />
            </>
          }
          </div>
      </div>
    </ThemeProvider>
  );
};

export default MainPage;