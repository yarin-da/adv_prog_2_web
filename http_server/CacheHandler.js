const fs = require('fs');
const AnomalyModel = require('./anomaly_detection/AnomalyModel');

class CacheHandler {
  constructor() {
    this.cachePath = './cache';
    this.maxCache = 10;
    this.cache = [];
  }
  
  toRelativePath(id) {
    return `${this.cachePath}/${id}.json`;
  }

  writeModelToDisk(cacheEntry) {
    const id = cacheEntry.id;
    const writePath = this.toRelativePath(id);
    const data = JSON.stringify(cacheEntry);
    fs.writeFileSync(writePath, data, 'utf8');
  }
  
  readJsonFile(id) {
    const readPath = this.toRelativePath(id);
    const options = {encoding: 'utf8', flag: 'r'};
    const data = fs.readFileSync(readPath, options);
    const {model, detector} = JSON.parse(data);
    const detectorData = detector.detector.data;
    const correlatedPairs = detector.detector.correlatedPairs;
    const anomalyModel = new AnomalyModel(model.type, detectorData, correlatedPairs);
    return {id: id, model: model, detector: anomalyModel};
  }

  loadModelFromCache(id) {
    const readPath = this.toRelativePath(id);
    if (fs.existsSync(readPath)) {
      return this.readJsonFile(id);
    }
    return null;
  }
  
  getFromMemory(id) {
    return this.cache.find((entry) => entry.id === id);
  }

  getFromDisk(id) {
    const filePath = this.toRelativePath(id);
    return fs.existsSync(filePath) ? this.loadModelFromCache(id) : null;
  }

  add(id, model, detector) {
    if (this.cache.length >= this.maxCache) {
      // remove the first cell in the array
      this.cache.splice(0, 1);
    }
    // append the loaded model to the array
    const new_model = {id: id, model: model, detector: detector};
    this.cache.push(new_model);
    this.writeModelToDisk(new_model);
  }

  get(id) {
    const mem = this.getFromMemory(id);
    if (mem != null) {
      return {model: mem.model, detector: mem.detector};
    }
    const disk = this.getFromDisk(id);
    if (disk != null) {
      return {model: disk.model, detector: disk.detector};
    }
    return null;
  }

  deleteFromDisk(id) {
    const filePath = this.toRelativePath(id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = CacheHandler;