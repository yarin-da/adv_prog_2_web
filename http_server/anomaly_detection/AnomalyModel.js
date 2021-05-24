const HybridDetector = require('./HybridDetector');
const SimpleDetector = require('./SimpleDetector');

class AnomalyModel {
  constructor(type, data, correlatedPairs) {
    // initialize a detector based on type
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
    // get all the anomalies
    const anomalies = this.detector.detect(data);
    // parse their timesteps into spans
    const parsed = {};
    const columns = Object.keys(anomalies);
    columns.forEach((key) => {
      if (anomalies[key].length !== 0) {
        parsed[key] = this.parseTimesteps(anomalies[key]);
      }
    });

    // add a reason for each anomaly pair
    // with feature1 as key, and feature2 as value
    let reason = {};
    const anomalyHeaders = Object.keys(anomalies);
    anomalyHeaders.forEach((header) => {
      reason[header] = this.detector.calcMaxCorrelatedFeature(header);
    });
    return {anomalies: parsed, reason: reason};
  }

  parseTimesteps(timesteps) {
    // parse anomaly timesteps into spans
    let newArr = [];
    let first = timesteps[0];
    let previous = timesteps[0];
    let current = timesteps[0];
    for (let i = 1; i < timesteps.length; i++) {
      current = timesteps[i];
      // we are inside a new span 
      if (previous < current - 1) {
        // close off the previous span and add it to the array
        const span = [first, previous + 1];
        newArr = [...newArr, span];
        // start off a new span
        first = current;
      }
      previous = current;
    }
    // close off the last span and add it to the array
    const span = [first, previous + 1];
    newArr = [...newArr, span];
    return newArr;
  }
}

module.exports = AnomalyModel;