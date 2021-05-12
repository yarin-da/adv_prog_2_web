import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

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
  {r: 110, g: 85,  b: 150},
  {r: 135, g: 180, b: 120},
  {r: 0, g: 150, b: 190},
  {r: 185, g: 130, b: 0},
  {r: 185, g: 185, b: 100},
];

const getColor = (index) => {
  const color = colors[index % colors.length];
  return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
}

const LineChart = ({data, anomalyPair, anomalies}) => {
  const MAX_X_LABELS = 150;

  const {chartData, chartOptions} = useMemo(() => {
    // return if there's no data
    if (data == null || data[0] == null) { 
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
      const maxColsToDisplay = 5;
      return anomalyPair.length > 0 ? anomalyPair.includes(col)
        : 0 < i && i <= Math.min(keys.length - 1, maxColsToDisplay);
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
        pointHitRadius: 15,
        segment: {
          borderColor: (ctx) => {
            const anomalyColor = 'rgb(200, 70, 70)';
            return anomalyPair != null && isAnomaly(anomalies, anomalyPair[0], skip, ctx) ? 
              anomalyColor 
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
            color: 'aliceblue',
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
            color: 'aliceblue',
          },
          title: {
            display: true,
            text: 'timesteps',
            color: 'aliceblue',
          }
        },
        y: {
          ticks: {
            color: 'aliceblue',
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
  }, [data, anomalyPair, anomalies]);

  return (
    <div className='GraphPanel'>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default LineChart;