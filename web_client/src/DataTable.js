import { useMemo } from "react";
import { DataGrid } from "@material-ui/data-grid";

// a data table for all the values in 'data'
const DataTable = ({headers, data}) => {
  // update columns and rows whenever 'data' updates
  const rows = useMemo(() => {
    return data;
  }, [data]);
  const columns = useMemo(() => {
    // make sure there's data
    if (data == null || data[0] == null) { return [] }
    // run through the keys to initialize all columns with default values
    return headers.map((header) => {
      return {
        field: header,
        headerName: header,
        sortable: false,
        width: 120,
      }
    });
  }, [data, headers]);
  return (
    <div className="TablePanel">
      <DataGrid rows={rows} columns={columns} pageSize={100} />
    </div>
  );
}

export default DataTable;