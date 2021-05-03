import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {ListItemIcon} from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {FixedSizeList} from "react-window";
import SearchBar from "./SearchBar";
import {useState} from "react";
import CheckmarkIcon from "../resources/checkmark_icon.png"
import WaitingIcon from "../resources/waiting_icon.png"

const listStyle = {
  backgroundColor: "#0a1a2a", 
  color: "#fff",
}

// this is used to override default styles by MUI
const muiTheme = createMuiTheme({
  overrides: {
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#445577",
          "&:hover": {
            backgroundColor: "#556677",
          },
        },
      },
      button: {
        "&:hover": {
          backgroundColor: "#334455",
        },
      },
    },
  },
});

const SelectList = () => {
  const models = [
    {
      model_id: 0,
      upload_time: "2021-04-22T19:15:32+02.00",
      status: "ready",
    },
    {
      model_id: 1,
      upload_time: "2021-04-21T18:17:32+02.00",
      status: "pending",
    },
    {
      model_id: 2,
      upload_time: "2021-04-25T21:15:32+02.00",
      status: "ready",
    },
  ]

  const [list, setList] = useState(models);
  const [selected, setSelected] = useState(-1);

  const onSearchChanged = (search) => {
    if (!search) {
      setList(models);
    } else {
      setList(models.filter((model) => {
        return model.model_id === parseInt(search);
      }));
    }
  }

  const handleListItemClick = (event, index) => {
    setSelected(index);
  };

  const renderRow = (props) => {
    const { index, style } = props;
    
    return (
      <ThemeProvider theme={muiTheme}>
        <ListItem 
            button 
            selected={index === selected}
            onClick={(event) => handleListItemClick(event, index)}
            style={style} 
            key={index}>
          <ListItemText primary={"model_id=" + list[index].model_id} />
          <ListItemIcon>
            <img 
              alt="icon"
              src={list[index].status === "pending" ? 
                    WaitingIcon : CheckmarkIcon} 
              width="20px" 
              height="20px" />
          </ListItemIcon>
        </ListItem>
      </ThemeProvider>
    );
  }

  return (
    <div className="ModelList">
      <SearchBar onSearchChanged={onSearchChanged} />
      <FixedSizeList 
        style= {listStyle}
        height={300} 
        width={250} 
        itemSize={50} 
        itemCount={list.length}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

export default SelectList;