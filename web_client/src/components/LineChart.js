import { Line } from "react-chartjs-2";
import { useMemo } from "react";

const isAnomaly = (anomalies, feature, skip, ctx) => {
  const spans = anomalies.anomalies[feature];
  if (spans == null) {
    return false;
  }
  for (let i = 0; i < spans.length; i++) {
    const start = spans[i][0] / skip;
    const end = spans[i][1] / skip;
    const x = ctx.p0.parsed.x
    if (start <= x && x <= end) {
      return true;
    }
  }
  return false;
};

const colors = [
  {r: 108, g: 86,  b: 152},
  {r: 168, g: 186, b: 122},
  {r: 148, g: 86,  b: 152},
  {r: 108, g: 126, b: 132},
  {r: 255, g: 255, b: 255},
];

const getColor = (index) => {
  const color = colors[index % colors.length];
  return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
}

const LineChart = ({data, columnFilter, anomalies}) => {
  const MAX_X_LABELS = 150;

  const {chartData, chartOptions} = useMemo(() => {
    // return if there's no data
    if (data == null || data[0] == null) { 
      return {}; 
    }
    if (columnFilter == null || columnFilter.length < 2) {
      return {};
    }
    if (anomalies == null) {
      return {};
    }

    // handle value skipping
    // because we want to display a max value of points 
    const max = Math.min(MAX_X_LABELS, data.length);
    const skip = Math.trunc(data.length / max);
    // init labels (i.e. x-axis values)
    const chartLabels = [];
    let labelValue = 0;
    for (let i = 0; i < max; i++) {
      chartLabels.push(labelValue);
      labelValue += skip;
    }

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
      const yValues = data
        .filter((row, i) => i % skip === 0)
        .map(row => row[header]);
      return {
        label: header,
        data: yValues,
        borderColor: color,
        radius: 0,
        segment: {
          borderColor: (ctx) => {
            return isAnomaly(anomalies, columnFilter[0], skip, ctx) ? 
              'rgb(175,55,55)' 
              : undefined;
          }
        },
      };
    });

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
            //callback: (val, index) => {
            //  return '';
            //},
            color: "aliceblue",
          },
          title: {
            display: true,
            text: "timesteps",
            color: "aliceblue",
          }
        },
        y: {
          ticks: {
            color: "aliceblue",
          },
        },
      },
    };
    // create the actual chart data
    const chartData = {
      labels: chartLabels,
      datasets: datasets,
    };
    return {chartData: chartData, chartOptions: chartOptions};
  }, [data, columnFilter, anomalies]);

  return (
    <div className="GraphPanel">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default LineChart;