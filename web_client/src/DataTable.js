import { useMemo } from "react";
import { DataGrid } from "@material-ui/data-grid";

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
    const keys = Object.keys(data[0]);
    return keys.map((key) => {
      return {
        field: key,
        headerName: key,
        sortable: false,
        width: 120,
      }
    });
  }, [data]);
  return (
    <div style={{ height: 400 }}>
      <DataGrid rows={rows} columns={columns} pageSize={100} />
    </div>
  );
}

export default DataTable;