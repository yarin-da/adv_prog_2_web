const HybridDetector = require('./HybridDetector');
const SimpleDetector = require('./SimpleDetector');

class AnomalyModel {
  constructor(type, data, correlatedPairs) {
    if (type === "hybrid") {
      this.detector = new HybridDetector(data, 0.5, correlatedPairs);
    } else {
      this.detector = new SimpleDetector(data, 0.9, correlatedPairs);
    }
  }

  learnNormal() {
    this.detector.learnNormal();
  }

  getAnomalies(data) {
    const anomalies = this.detector.detect(data);
    const parsed = {};
    const columns = Object.keys(anomalies);
    columns.forEach((key) => {
      if (anomalies[key].length !== 0) {
        parsed[key] = this.parseTimesteps(anomalies[key]);
      }
    });

    let reason = {};
    const anomalyHeaders = Object.keys(anomalies);
    anomalyHeaders.forEach((header) => {
      reason[header] = this.detector.calcMaxCorrelatedFeature(header);
    });
    return {anomalies: parsed, reason: reason};
  }

  parseTimesteps(timesteps) {
    let newArr = [];
    let first = timesteps[0];
    let previous = timesteps[0];
    let current = timesteps[0];
    for (let i = 1; i < timesteps.length; i++) {
      current = timesteps[i];
      if (previous < current - 1) {
        const span = [first, previous + 1];
        newArr = [...newArr, span];
        first = current;
      }
      previous = current;
    }
    const span = [first, previous + 1];
    newArr = [...newArr, span];
    return newArr;
  }
}

module.exports = AnomalyModel;