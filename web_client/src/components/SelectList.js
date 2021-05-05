import {useState, useMemo} from "react";
import SearchBar from "./SearchBar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FixedSizeList} from "react-window";
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IconButton from "@material-ui/core/IconButton";

const listStyle = {
  backgroundColor: "#0a1a2a", 
  color: "#fff",
  borderTop: "solid #607f9f 1px",
  borderBottom: "solid #607f9f 1px",
}

const SelectList = ({models, selectedModel, onModelSelected, onDeleteItem}) => {
  const [search, setSearch] = useState("");
  const onSearchChanged = (search) => {
    setSearch(search);
  }
  const list = useMemo(() => {
    if (!search) {
      return models;
    }
    const filtered = models.filter((model) => {
      return model.model_id === parseInt(search);
    });
    return filtered;
  }, [search, models]);

  const parseTime = (time) => {
    const splitTime = time.split("T");
    return {date: splitTime[0], hour: splitTime[1].split("+")[0]};
  };

  const renderRow = ({index, style}) => {
    const model = list[index];
    const isSelected = selectedModel === model.model_id;
    const {date, hour} = parseTime(model.upload_time);
    return (
      <ListItem 
          button 
          selected={isSelected}
          onClick={(event) => onModelSelected(model.model_id)}
          style={style} 
          key={index}>
        <ListItemIcon>
          {
            model.status === "pending" ?
            <HourglassEmptyIcon />
            : <CheckCircleIcon />
          }
        </ListItemIcon>
        <ListItemText 
          primary={"ID: " + model.model_id} 
          secondary={`${date} ${hour}`} />
        <IconButton
          onClick={() => onDeleteItem(model.model_id)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }

  return (
    <div>
      <SearchBar onSearchChanged={onSearchChanged} />
      <FixedSizeList 
        style={listStyle}
        height={200} 
        width={250} 
        itemSize={70} 
        itemCount={list.length}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

export default SelectList;