import {useState, useMemo} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {FixedSizeList} from "react-window";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SearchBar from "./SearchBar";

const listStyle = {
  backgroundColor: "#0a1a2a", 
  color: "#fff",
  borderTop: "solid #607f9f 1px",
  borderBottom: "solid #607f9f 1px",
}

const AnomalyList = ({anomalies, selectedAnomalyPair, onAnomalyPairSelected}) => {
  const [search, setSearch] = useState("");
  const onSearchChanged = (search) => {
    setSearch(search);
  }
  const list = useMemo(() => {
    const reasons = Object.keys(anomalies.reason);
    const filtered = reasons.filter((feature) => {
      const str = `${feature} - ${anomalies.reason[feature]}`;
      return !search || str.includes(search);
    });
    return filtered;
  }, [search, anomalies]);

  const renderRow = ({index}) => {
    const feature1 = list[index];
    const feature2 = anomalies.reason[feature1];
    return (
      <ListItem 
          button 
          key={index}
          selected={feature1 === selectedAnomalyPair[0]}
          onClick={() => onAnomalyPairSelected([feature1, feature2])}>
        <ListItemText 
          primary={feature1}/>
        <ListItemIcon>
          <ArrowRightAltIcon />
        </ListItemIcon>
        <ListItemText 
          primary={feature2}/>
      </ListItem>
    );
  }

  return (
    <div>
      <SearchBar onSearchChanged={onSearchChanged} />
      <FixedSizeList 
        style= {listStyle}
        height={250} 
        width={250} 
        itemSize={50} 
        itemCount={list.length}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

export default AnomalyList;