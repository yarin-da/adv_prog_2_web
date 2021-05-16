import { useCallback } from 'react';
import FileDropzone from './FileDropzone';

const parseLine = (line, headers) => {
  const cols = line.trim().split(',');
  let newLine = {};
  headers.forEach((val, index) => {
    newLine[val] = cols[index];
  });
  return newLine;
};

const parseCsvToJson = (csvData) => {
  if (csvData == null) { return []; }
  const lines = csvData.trim().split('\n');
  if (csvData.length <= 0) { return []; }
  const keys = lines[0].trim().split(',');
  const strippedHeaders = lines.slice(1, lines.length - 1);
  const parsed = strippedHeaders.map(
    (line) => parseLine(line, keys)
  );
  return parsed;
};

// a wrapper for FileDropzone
// loads only csv files and parses them to json
const CsvDropzone = ({text, onDataChanged}) => {
  const csvType = '.csv, application/vnd.ms-excel, text/csv';
  
  const onFileLoad = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length <= 0) { return; }
      const file = acceptedFiles[0];
      // use a reader to read the file's data and parse it to json
      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        const parsed = parseCsvToJson(contents);
        onDataChanged(parsed);
      }
      reader.readAsText(file);
    },
    [onDataChanged]
  );

  return (
    <FileDropzone 
      text={text} 
      type={csvType} 
      onFileChosen={onFileLoad}
    />
  );
}

export default CsvDropzone;