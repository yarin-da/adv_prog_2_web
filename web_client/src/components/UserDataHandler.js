import CsvDropzone from "./CsvDropzone";
import "./UserDataHandler.css";

const UserDataHandler = ({modelType, onModelTypeChanged, onDetectDataChanged, onTrainDataChanged}) => {
  return (
    <div className="UserDataHandlerContainer">
      <CsvDropzone 
      onDataChanged={onDetectDataChanged}
      text="Drop a flight data file" />
      <div className="TrainDataPanel">
        <CsvDropzone 
          onDataChanged={onTrainDataChanged}
          text="Drop a training data file" />
        <div className="ModelTypePanel">
          <label 
            className={`ModelTypeLabel ${modelType === "regression" ? "ModelTypeSelected" : ""}` }
            onClick={ () => onModelTypeChanged("regression") }>
              Regression
          </label>
          <label 
            className={`ModelTypeLabel ${modelType === "hybrid" ? "ModelTypeSelected" : ""}` } 
            onClick={ () => onModelTypeChanged("hybrid") }>
              Hybrid
          </label>
        </div>
      </div>
    </div>
  );
}

export default UserDataHandler;