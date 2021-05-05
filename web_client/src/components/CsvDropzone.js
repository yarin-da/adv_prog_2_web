import FileDropzone from "./FileDropzone";
import csvToJson from "csvtojson";

// a wrapper for FileDropzone
// loads only csv files and parses them to json
const CsvDropzone = ({text, onDataChanged}) => {
  const csvType = ".csv, application/vnd.ms-excel, text/csv";

  const onFileLoad = (file) => {
    // store the csv file's data
    var data = [];
    // use a reader to read the file's data and parse it to json
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const contents = reader.result;
      var counter = 0;
      csvToJson()
        .fromString(contents)
        .subscribe((line) => {
          // add a unique id (counter) to that line
          const newLine = { id: counter, ...line};
          // append a new line to data
          data = [...data, newLine];
          counter++;
        }, null, () => {
          // finally, notify the parent that new data has arrived
          onDataChanged(data);
        });
    }
    reader.readAsText(file);
  }

  return (
    <FileDropzone 
      text={text} 
      type={csvType} 
      onFileChosen={onFileLoad} />
  );
}

export default CsvDropzone;