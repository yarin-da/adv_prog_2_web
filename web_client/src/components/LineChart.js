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
        color: "aliceblue",
      }
    },
  },
}

const colors = [
  {r: 255, g: 255, b: 255},
  {r: 108, g: 86,  b: 152},
  {r: 148, g: 86,  b: 152},
  {r: 108, g: 126, b: 132},
  {r: 168, g: 186, b: 122},
];

const getColor = (index) => {
  const color = colors[index % colors.length];
  return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
}

const LineChart = ({data, columnFilter}) => {
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
    const keys = Object.keys(data[0]);
    const datasets = keys
    .filter((col, i) => {
      return columnFilter.length > 0 ? columnFilter.includes(col)
        : 0 < i && i < Math.min(keys.length, 5);
    })
    .map((header, index) => {
      const color = getColor(index);
      return getDataSet(data, header, skip, color);
    })
    // create the actual chart data
    const ret = {
      labels: chartLabels,
      datasets: datasets,
    }
    return ret;
  }, [data, columnFilter]);

  return (
    <div className="GraphPanel">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default LineChart;