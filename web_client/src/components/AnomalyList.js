import { useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ErrorIcon from '@material-ui/icons/Error';
import SearchBar from './SearchBar';

// override default font size
const useStyles = makeStyles({
  item: {
    '& span, & svg': {
      fontSize: '0.9rem'
    }
  },
});

// set list colors
const listStyle = {
  backgroundColor: '#071727', 
  color: '#fff',
};

const AnomalyList = ({anomalies, selectedAnomalyPair, onAnomalyPairSelected}) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const onSearchChanged = (search) => {
    setSearch(search);
  }

  // create the list of entries and cache it
  const list = useMemo(
    () => {
      if (anomalies == null) { return []; }
      const reasons = Object.keys(anomalies.reason);
      // filter by search
      const filtered = reasons.filter((feature) => {
        const str = `${feature} - ${anomalies.reason[feature]}`;
        return !search || str.includes(search);
      });
      return filtered;
    }, 
    [search, anomalies]
  );

  const isItemSelected = (feature) => {
    if (selectedAnomalyPair.length <= 0) return false;
    return feature === selectedAnomalyPair[0];
  };

  const onItemClicked = (feature1, feature2) => {
    if (isItemSelected(feature1)) {
      // if the entry is already selected - unselect it!
      onAnomalyPairSelected([]);
    } else {
      onAnomalyPairSelected([feature1, feature2]);
    }
  };

  // draw an entry in the list
  const renderRow = ({index}) => {
    const feature1 = list[index];
    const feature2 = anomalies.reason[feature1];
    return (
      <>
        <ListItem 
          button 
          key={index}
          classes={classes.listitem}
          selected={isItemSelected(feature1)}
          onClick={() => onItemClicked(feature1, feature2)}
        >
          <ListItemAvatar>
              <ErrorIcon style={{color: 'lightcoral'}} />
          </ListItemAvatar>
          <ListItemText
            className={classes.item}
            primary={feature1}
            secondary={feature2}
          />
        </ListItem>
        <Divider light />
      </>
    );
  };

  // draw the list
  return (
    <div>
      <SearchBar 
        label='Anomaly List'
        onSearchChanged={onSearchChanged}
      />
      <FixedSizeList 
        style={listStyle}
        height={265} 
        itemSize={50} 
        itemCount={list.length}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

export default AnomalyList;