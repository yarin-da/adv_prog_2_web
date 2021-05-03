import { Line } from "react-chartjs-2";
import { useMemo } from "react";

const chartOptions = {
  responsive: true, 
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        // legend text colors
        color: "aliceblue",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        // hide all x axis labels
        callback: (val, index) => {
          return '';
        },
      }
    },
    y: {
      ticks: {
        color: "white",
      }
    },
  },
}

const palette = [
  {r: 1,   g: 0.6, b: 0.8},
  {r: 1,   g: 0.9, b: 0.6},
  {r: 0.5, g: 0.7, b: 0.6},
  {r: 0.8, g: 0.6, b: 0.9},
  {r: 0.8, g: 1,   b: 0.9},
];

const getColor = (seed) => {
  const theme = palette[Math.floor(palette.length * Math.random())];
  const red = Math.floor(seed * theme.r);
  const green = Math.floor(seed * theme.g);
  const blue = Math.floor(seed * theme.b);
  return `rgba(${red}, ${green}, ${blue}, 1)`;
}

const LineChart = ({data}) => {
  const MAX_X_LABELS = 50;

  const getDataSet = (data, header, skip, color) => {
    const yValues = data
      .filter((row, i) => i % skip === 0)
      .map(row => row[header]);
    return {
      label: header,
      data: yValues,
      borderColor: color,
      radius: 0,
    }
  };

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
    const datasets = Object.keys(data[0])
    .filter((row, i) => 0 < i && i < 5)
    .map((header) => {
      const color = getColor(200 * Math.random() + 55);
      return getDataSet(data, header, skip, color);
    })
    // create the actual chart data
    const ret = {
      labels: chartLabels,
      datasets: datasets,
    }
    return ret;
  }, [data]);

  return (
    <div className="GraphPanel">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default LineChart;