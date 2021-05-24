const SimpleDetector = require('./SimpleDetector');

class HybridDetector extends SimpleDetector {
  constructor(data, correlation_threshold, correlatedPairs) {
    super(data, correlation_threshold, correlatedPairs);
    this.line_threshold = 0.9;
  }

  createCorrelatedPair(feature1, feature2, correlation) {
    if (Math.abs(correlation) < this.line_threshold) {
      return this.createCircleStructurePair(feature1, feature2, correlation)
    }
    return super.createCorrelatedPair(feature1, feature2, correlation);
  }

  createCircleStructurePair(feature1, feature2, correlation) {
    let points = [];
    for (let i = 0; i < this.data[feature1].length; i++) {
      const x = parseFloat(this.data[feature1][i]);
      const y = parseFloat(this.data[feature2][i]);
      points = [...points, {x: x, y: y}];
    }
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
    if (pair.correlation < this.line_threshold) {
      const x = pair.x;
      const y = pair.y;
      const r = pair.threshold;
      return x * x + y * y > r * r;
    }
    return super.isAnomaly(pair, point);
  }

}

module.exports = HybridDetector;