import {Button} from "@material-ui/core";
import CsvDropzone from "./CsvDropzone";
import {makeStyles, lighten} from '@material-ui/core/styles';
import "./UserDataHandler.css";

const useStyles = makeStyles((theme) => {
  return {
    selected: {
      backgroundColor: lighten(theme.palette.info.main, 0.5),
      '&:hover': {
        backgroundColor: lighten(theme.palette.info.main, 0.8),
      },
    },
    regular: {
      backgroundColor: theme.palette.info.main,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
    },
  };
});

const UserDataHandler = ({modelType, onModelTypeChanged, onDetectDataChanged, onTrainDataChanged}) => {
  const classes = useStyles();
  return (
    <div className="UserDataHandlerContainer">
      <fieldset>
        <legend style={{color: 'white'}}>Analyze Data</legend>
        <CsvDropzone 
          onDataChanged={onDetectDataChanged}
          text="Drop a flight data file" />
      </fieldset>
      <fieldset>
        <legend style={{color: 'white'}}>Upload Model</legend>
        <Button
          fullWidth
          color="secondary"
          variant={modelType === "regression" ? "contained" : "outlined"}
          onClick={ () => onModelTypeChanged("regression") }>
            Regression
        </Button>
        <Button
          fullWidth
          color="secondary"
          variant={modelType === "hybrid" ? "contained" : "outlined"}
          onClick={ () => onModelTypeChanged("hybrid") }>
            Hybrid
        </Button>
        <CsvDropzone 
          onDataChanged={onTrainDataChanged}
          text="Drop a training data file" />
      </fieldset>
    </div>
  );
}

export default UserDataHandler;