import SearchIcon from "../resources/search_icon.png";
import "./SearchBar.css";

const SearchBar = ({onSearchChanged}) => {
  return (
    <div className="SearchBar">
      <div style={{padding: "5px"}}>
        <img src={SearchIcon} alt="icon" width="30px" height="30px"/>
      </div>
      <input 
        className="SearchInput"
        placeholder="search here!" 
        onChange={
          (event) => { onSearchChanged(event.target.value) }
        } />
    </div>
  );
}

export default SearchBar;