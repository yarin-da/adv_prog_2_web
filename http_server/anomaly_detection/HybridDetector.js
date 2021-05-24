const SimpleDetector = require('./SimpleDetector');

class HybridDetector extends SimpleDetector {
  constructor(data, correlationThreshold, correlatedPairs) {
    super(data, correlationThreshold, correlatedPairs);
    this.lineThreshold = 0.9;
  }

  createCorrelatedPair(feature1, feature2, correlation) {
    // return a correlated pair based on correlation
    if (Math.abs(correlation) < this.lineThreshold) {
      return this.createCircleStructurePair(feature1, feature2, correlation)
    }
    return super.createCorrelatedPair(feature1, feature2, correlation);
  }

  createCircleStructurePair(feature1, feature2, correlation) {
    const points = super.createPointArray(feature1, feature2);
    
    // get the smallest enclosing circle of these points
    const circle = this.util.minCircle(points);

    const pair = {
      feature1: feature1,
      feature2: feature2,
      correlation: correlation,
      x: circle.x,
      y: circle.y,
      threshold: circle.r,
    }
    return pair;
  }

  isAnomaly(pair, point) {
    // if we're working with a circle (based on correlation)
    if (pair.correlation < this.lineThreshold) {
      const x = pair.x;
      const y = pair.y;
      const r = pair.threshold;
      return x * x + y * y > r * r;
    }
    // otherwise, we're working with linear regression
    // use the parent class to determine anomalies
    return super.isAnomaly(pair, point);
  }

}

module.exports = HybridDetector;