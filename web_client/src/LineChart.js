import { Line } from "react-chartjs-2";
import { useMemo } from "react";

const chartOptions = {
  scales: {
    x: {
      ticks: {
        // hide all x axis labels
        callback: function(val, index) {
          return '';
        },
        color: "white",
      }
    },
    y: {
      ticks: {
        color: "white",
      }
    },
  }
}

const LineChart = ({headers, data}) => {
  const MAX_X_LABELS = 50;

  const chartData = useMemo(() => {
    // return if there's no data
    if (data == null || data[0] == null) { 
      return {}; 
    }

    // handle value skipping
    // because we want to display a max value of points 
    const max = Math.min(MAX_X_LABELS, data.length);
    const skip = Math.trunc(data.length / max);
    // init labels (i.e. x-axis values)
    const chartLabels = [...Array(max).keys()];

    // init y-values for each column
    // use filter to skip some of the values
    // and map to grab the relevant value from each row
    const firstHeader = headers[1];
    const secondHeader = headers[2];
    const firstY = data
        .filter((row, i) => i % skip === 0)
        .map(row => row[firstHeader]);
    const secondY = data
        .filter((row, i) => i % skip === 0)
        .map(row => row[secondHeader]);
    // create the actual chart data
    const ret = {
      labels: chartLabels,
      datasets: [
        {
          label: firstHeader,
          data: firstY,
          borderColor: "#534",
          radius: 0,
        },
        {
          label: secondHeader,
          data: secondY,
          borderColor: "#867",
          radius: 0,
        },
      ]
    }
    return ret;
  }, [data, headers]);

  return (
    <div className="GraphPanel">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default LineChart;