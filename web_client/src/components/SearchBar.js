import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const SearchBar = ({onSearchChanged, label}) => {
  return (
    <TextField 
      color='secondary'
      variant='filled' 
      size='small'
      style={{backgroundColor: 'black'}}
      onChange={(event) => onSearchChanged(event.target.value)}
      label={label}
      fullWidth
      InputProps={
        {
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon/>
            </InputAdornment>
          ),
        }
      }
    />
  );
}

// by default - do nothing when search text is changed
SearchBar.defaultProps = {
  label: 'Search',
  onSearchChanged: (e) => {},
};

export default SearchBar;