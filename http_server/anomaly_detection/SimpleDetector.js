const AnomalyUtil = require('./AnomalyUtil');

class SimpleDetector {
  constructor(data, correlationThreshold, correlatedPairs) {
    this.util = new AnomalyUtil();
    this.data = data;
    this.correlationThreshold = correlationThreshold;
    // if no correlatedPairs has been provided - initialize to []
    if (correlatedPairs == null) { 
      correlatedPairs = []; 
    }
    this.correlatedPairs = correlatedPairs;
  }

  learnNormal() {
    const features = Object.keys(this.data);
    // find the most correlated feature for each feature
    features.forEach((feature) => {
      // if we didn't already pair this feature
      if (this.getCorrelatedPair(feature) == null) {
        const maxFeature = this.calcMaxCorrelatedFeature(feature);
        // if we found a max correlated feature
        if (maxFeature) {
          const xArr = this.data[feature];
          const yArr = this.data[maxFeature];
          const correlation = this.util.pearson(xArr, yArr);
          // if this is the highest correlation we found so far
          if (Math.abs(correlation) > this.correlationThreshold) {
            // create a pair structure and add it to the array
            const pair = this.createCorrelatedPair(feature, maxFeature, correlation);
            this.correlatedPairs = [...this.correlatedPairs, pair];
          }
        }
      }
    });
  }

  createPointArray(feature1, feature2) {
    let points = [];
    for (let i = 0; i < this.data[feature1].length; i++) {
      const p = {x: this.data[feature1][i], y: this.data[feature2][i]};
      points = [...points, p];
    }
    return points;
  }

  createCorrelatedPair(feature1, feature2, correlation) {
    const points = this.createPointArray(feature1, feature2);
    const line = this.util.linear_regression(points);
    
    // get the max deviation
    let maxOffset = 0;
    points.forEach((point) => {
      const deviation = Math.abs(this.util.dev(line, point));
      if (maxOffset < deviation) {
        maxOffset = deviation;
      }
    });
    
    const pair = {
      feature1: feature1,
      feature2: feature2,
      correlation: correlation,
      x: line.slope,
      y: line.b,
      threshold: maxOffset,
    };
    return pair;
  }

  // return a pair structure
  // if feature is either feature1 or feature2
  getCorrelatedPair(feature) {
    for (let i = 0; i < this.correlatedPairs.length; i++) {
      const pair = this.correlatedPairs[i];
      if (pair.feature1 === feature || pair.feature2 === feature) {
        return pair;
      }
    }
    return null;
  }

  calcMaxCorrelatedFeature(feature) {
    let maxFeature = feature;
    let maxCorrelation = -1;
    // find the feature that has the highest correlation to the param
    const features = Object.keys(this.data);
    features.forEach((col) => {
      if (col !== feature) {
        const xArr = this.data[feature];
        const yArr = this.data[col];
        const correlation = Math.abs(this.util.pearson(xArr, yArr));
        // if it is the highest correlation we found so far
        if (correlation > maxCorrelation) {
          maxCorrelation = correlation;
          maxFeature = col;
        }
      }
    });
    return maxFeature;
  }

  detect(newData) {
    const anomalies = {};
    const features = Object.keys(newData);
    const size = newData[features[0]].length;
    // run through each line in newData
    for (let i = 0; i < size; i++) {
      // run through each feature
      features.forEach((feature) => {
        const pair = this.getCorrelatedPair(feature);
        if (pair != null && pair.feature1 === feature) {
          const point = {
            x: newData[pair.feature1][i], 
            y: newData[pair.feature2][i],
          };
          if (this.isAnomaly(pair, point)) {
            // make sure anomalies is not null before we append to it
            if (anomalies[feature] == null) {
              anomalies[feature] = [];
            }
            anomalies[feature] = [...anomalies[feature], i];
          }
        }
      });
    }
    return anomalies;
  }

  isAnomaly(pair, point) {
    // multiplier to get rid of false positives
    const multiplier = 1.15;
    const slope = pair.x;
    const b = pair.y;
    const deviation = Math.abs(this.util.dev({slope: slope, b: b}, point));
    return deviation > multiplier * pair.threshold;
  }
}

module.exports = SimpleDetector;