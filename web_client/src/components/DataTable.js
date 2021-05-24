import { useMemo, useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles, darken, lighten } from '@material-ui/core/styles';

// override default styles
const useStyles = makeStyles((theme) => {
  return {
    root: {
      borderColor: '#6c6c6c',
      '& .MuiDataGrid-cell:focus-within': {
        outline: 'none',
      },
      // a special style for anomaly rows (marked as red)
      '& .anomalyRow': {
        backgroundColor: darken(theme.palette.error.main, 0.5),
        '&:hover': {
          backgroundColor: darken(theme.palette.error.main, 0.25),
        },
      },
      // override hover color for regular lines
      '& .MuiDataGrid-row': {
        '&:hover': {
          backgroundColor: lighten('#0a1a2a', 0.1),
        },
      },
    },
  };
});

// a data table for all the values in 'data'
const DataTable = ({data, anomalies, anomalyPair}) => {
  // update columns and rows whenever 'data' updates
  const rows = useMemo(
    // add a unique id for each row
    () => data.map((line, index) => { return {id: index, ...line}; }), 
    [data]
  );
  const columns = useMemo(
    () => {
      // make sure there's data
      if (data == null || data[0] == null) { return [] }
      // run through the keys to initialize all columns with default values
      return Object.keys(data[0]).map(
        (header) => {
          return {
            field: header,
            headerName: header,
            sortable: false,
            width: 120,
          }
        }
      );
    }, 
    [data]
  );
  
  const [anomalyLines, setAnomalyLines] = useState(new Set());
  useEffect(
    () => {
      if (anomalies == null) { return; }
      // get the columns of features that contain anomalies
      const columns = Object
        .keys(anomalies.anomalies)
        .filter((key) => 
          anomalyPair == null || 
          anomalyPair.length < 2 || 
          key === anomalyPair[0] || 
          key === anomalyPair[1]);

      // save all lines that contain anomalies
      const lines = new Set();
      columns.forEach((col) => {
        anomalies.anomalies[col].forEach((span) => {
          for (var i = span[0]; i < span[1]; i++) {
            lines.add(i);
          }
        });
      });
      setAnomalyLines(lines);
    }, 
    [anomalies, anomalyPair]
  );

  const classes = useStyles();
  return (
    <div style={{padding: 10}}>
      <DataGrid 
        rows={rows} 
        columns={columns}
        className={classes.root}
        disableSelectionOnClick={true}
        disableColumnMenu={true}
        getRowClassName={
          (params) => {
            const rowID = params.row.id;
            const exists = anomalyLines.has(rowID);
            return exists ? 'anomalyRow' : 'regularRow';
          }
        }
        pageSize={100} />
      </div>
  );
}

export default DataTable;