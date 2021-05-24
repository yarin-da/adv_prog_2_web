import React from 'react';
import { Line } from 'react-chartjs-2';

const MAX_X_LABELS = 150;

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

// default linechart colors
const colors = [
  {r: 0, g: 150, b: 190},
  {r: 110, g: 85,  b: 150},
  {r: 135, g: 180, b: 120},
  {r: 185, g: 185, b: 100},
  {r: 185, g: 130, b: 0},
];

class Graph extends React.Component {
  getColor(index) {
    const color = colors[index % colors.length];
    return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
  }

  missingData(data, anomalies) {
    return data == null || data[0] == null || anomalies == null;
  }

  // figure out if ctx is inside an anomaly segment
  isAnomaly(anomalies, feature, skip, ctx) {
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

  // re-render the graph only when graphUpdates has been changed
  // this is a way to avoid unnecessary re-renders
  shouldComponentUpdate(nextProps, nextState) {
    const oldUpdates = this.props.graphUpdates;
    const newUpdates = nextProps.graphUpdates;
    return oldUpdates !== newUpdates;
  }

  createChartData(data, anomalyPair, anomalies) {
    if (this.missingData(data, anomalies)) {
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
    const filtered = keys
    .filter((col, i) => {
      const maxColsToDisplay = 5;
      return anomalyPair.length > 0 ? anomalyPair.includes(col)
        : 0 < i && i <= Math.min(keys.length - 1, maxColsToDisplay);
    });
    const datasets = filtered.map((header, index) => {
      const color = this.getColor(index);
      // filter some of the rows by skip
      // and get the relevant column values
      const yValues = data
        .filter((row, i) => i % skip === 0)
        .map(row => row[header]);
      return {
        label: header,
        data: yValues,
        borderColor: color,
        radius: 0,
        pointHitRadius: 15,
        // mark an anomaly segment as red
        segment: {
          borderColor: (ctx) => {
            const anomalyColor = 'rgb(200, 70, 70)';
            const isAnomalySegment = this.isAnomaly(anomalies, anomalyPair[0], skip, ctx);
            return anomalyPair != null && isAnomalySegment ? anomalyColor : undefined;
          }
        },
      };
    });

    // create the actual chart data
    const chartData = {
      labels: chartLabels,
      datasets: datasets,
    };

    return chartData;
  }

  render() {
    const data = this.props.data;
    const anomalyPair = this.props.anomalyPair;
    const anomalies = this.props.anomalies;
    const chartData = this.createChartData(data, anomalyPair, anomalies)

    return (
      <div className='GraphPanel'>
        <Line options={chartOptions} data={chartData} />
      </div>
    );
  }
}

export default Graph;