import { useMemo } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./DataTable.css";

// a data table for all the values in 'data'
const DataTable = ({data}) => {
  // update columns and rows whenever 'data' updates
  const rows = useMemo(() => {
    return data;
  }, [data]);
  const columns = useMemo(() => {
    // make sure there's data
    if (data == null || data[0] == null) { return [] }
    // run through the keys to initialize all columns with default values
    return Object.keys(data[0]).map((header) => {
      return {
        field: header,
        headerName: header,
        sortable: false,
        width: 120,
      }
    });
  }, [data]);
  
  return (
    <div className="TablePanel">
      <DataGrid 
        rows={rows} 
        columns={columns}
        className="TableStyling"
        disableSelectionOnClick={true}
        scrollbarSize={5}
        pageSize={100} />
    </div>
  );
}

export default DataTable;