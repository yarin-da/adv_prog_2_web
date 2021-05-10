import {useMemo, useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles, darken} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
        outline: 'none',
      },
      '& .anomalyRow': {
        backgroundColor: darken(theme.palette.error.main, 0.5),
        '&:hover': {
          backgroundColor: darken(theme.palette.error.main, 0.25),
        },
      },
    },
  };
});

// a data table for all the values in 'data'
const DataTable = ({data, anomalies, anomalyPair}) => {
  // update columns and rows whenever 'data' updates
  const rows = useMemo(() => data, [data]);
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
  
  const [anomalyLines, setAnomalyLines] = useState(new Set());
  const updateAnomalyLines = useMemo(() => {
    if (anomalies == null) { return; }
    const lines = new Set();
    const columns = Object
      .keys(anomalies.anomalies)
      .filter((key) => 
        anomalyPair == null || 
        anomalyPair.length < 2 || 
        key === anomalyPair[0] || 
        key === anomalyPair[1]);

    columns.forEach((col) => {
      anomalies.anomalies[col].forEach((span) => {
        for (var i = span[0]; i < span[1]; i++) {
          lines.add(i);
        }
      });
    });
    setAnomalyLines(lines);
  }, [anomalies, anomalyPair]);

  const classes = useStyles();
  return (
    <DataGrid 
      rows={rows} 
      columns={columns}
      className={classes.root}
      getRowClassName={
        (params) => {
          const rowID = params.getValue('id');
          const exists = anomalyLines.has(rowID);
          return exists ? 'anomalyRow' : 'regularRow';
        }
      }
      pageSize={100} />
  );
}

export default DataTable;