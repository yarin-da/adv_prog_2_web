import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import "./SearchBar.css";

const SearchBar = ({onSearchChanged}) => {
  return (
    <TextField 
      color="primary"
      variant="outlined" 
      size="small"
      onChange={(event) => {onSearchChanged(event.target.value)}}
      placeholder="Search"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        ),
      }}/>
  );
}

export default SearchBar;