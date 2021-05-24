const findMinCircle = require('smallest-enclosing-circle');

class AnomalyUtil {
  average(arr) {
    let sum = 0;
    arr.forEach((value) => {
      sum += parseFloat(value);
    });
    const size = arr.length;
    return sum / size;
  }
  
  variance(arr) {
    let sumSquared = 0;
    const size = arr.length;
    arr.forEach((value) => {
      const val = parseFloat(value);
      sumSquared += val * val;
    });
    const avg = this.average(arr);
    
    return (sumSquared / size) - (avg * avg);
  }
  
  covariance(xArr, yArr) {
    const xAvg = this.average(xArr);
    const yAvg = this.average(yArr);
    const size = xArr.length;
  
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const xDiff = parseFloat(xArr[i]) - xAvg;
      const yDiff = parseFloat(yArr[i]) - yAvg;
      sum += xDiff * yDiff;
    }
    return sum / size;
  }
  
  pearson(xArr, yArr) {
    const xDev = Math.sqrt(this.variance(xArr));
    const yDev = Math.sqrt(this.variance(yArr));
    const covariance = this.covariance(xArr, yArr);
    if (covariance === 0) {
      return 0; 
    }
    return covariance / (xDev * yDev);
  }
  
  linear_regression(points) {
    const xArr = points.map((value) => value.x);
    const yArr = points.map((value) => value.y);
    const slope = this.covariance(xArr, yArr) / this.variance(xArr);
    const xAvg = this.average(xArr);
    const yAvg = this.average(yArr);
    const b = yAvg - slope * xAvg;
    return { slope: slope, b: b };
  }
  
  dev(line, point) {
    const fx = line.slope * point.x + line.b;
    return Math.abs(fx - point.y);
  }

  minCircle(points) {
    // call the imported findMinCircle function
    return findMinCircle(points);
  }
}

module.exports = AnomalyUtil;