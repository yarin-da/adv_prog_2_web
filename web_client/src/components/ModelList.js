import { useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IconButton from '@material-ui/core/IconButton';
import SearchBar from './SearchBar';

const listStyle = {
  backgroundColor: '#071727', 
  color: '#fff',
}

const SelectList = ({models, selectedModel, onModelSelected, onDeleteItem}) => {
  const [search, setSearch] = useState('');
  const onSearchChanged = (search) => {
    setSearch(search);
  }

  // update and cache the model list entries
  const list = useMemo(() => {
    if (!search) {
      return models;
    }
    // filter list by search
    const filtered = models.filter((model) => {
      return `id=${model.model_id} ${model.upload_time} ${model.status}`.includes(search);
    });
    return filtered;
  }, [search, models]);

  const parseTime = (time) => {
    const splitTime = time.split('T');
    return {date: splitTime[0], hour: splitTime[1].split('+')[0]};
  };

  const getTitle = (id) => {
    const type = (id % 2 === 0) ? 'Linear' : 'Hybrid';
    return `${type} ${id}`;
  }

  const renderRow = ({index, style}) => {
    const model = list[index];
    const isSelected = (selectedModel != null && selectedModel.model_id === model.model_id);
    const {date, hour} = parseTime(model.upload_time);
    return (
      <>
        <ListItem 
            button 
            selected={isSelected}
            onClick={(event) => onModelSelected(model)}
            style={style} 
            key={index}>
          <ListItemIcon>
            { // model status icon
              model.status === 'pending' ?
              <HourglassEmptyIcon />
              : <CheckCircleIcon style={{color: 'lightgreen'}} />
            }
          </ListItemIcon>
          <ListItemText 
            primary={getTitle(model.model_id)} 
            secondary={`${date} ${hour}`} />
          <IconButton
            onClick={() => onDeleteItem(model.model_id)}>
            <DeleteIcon style={{color: 'lightslategray'}} />
          </IconButton>
        </ListItem>
        <Divider light />
      </>
    );
  }

  return (
    <div>
      <SearchBar 
        label='Model List'
        onSearchChanged={onSearchChanged} />
      <FixedSizeList 
        style={listStyle}
        height={285} 
        itemSize={70} 
        itemCount={list.length}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

export default SelectList;