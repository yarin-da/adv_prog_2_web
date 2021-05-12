import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const SearchBar = ({onSearchChanged, label}) => {
  return (
    <TextField 
      color='secondary'
      variant='filled' 
      size='small'
      style={{backgroundColor: '#353535'}}
      onChange={(event) => onSearchChanged(event.target.value)}
      label={label}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <SearchIcon/>
          </InputAdornment>
        ),
      }}/>
  );
}

SearchBar.defaultProps = {
  label: 'Search',
};

export default SearchBar;