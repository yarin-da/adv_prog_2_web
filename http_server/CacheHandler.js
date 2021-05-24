const fs = require('fs');
const AnomalyModel = require('./anomaly_detection/AnomalyModel');

class CacheHandler {
  constructor() {
    this.cachePath = './cache';
    // max amount of models that are save on RAM
    this.maxCache = 10;
    this.cache = [];
    // create the cache folder if it doesn't exist
    fs.mkdirSync(this.cachePath, { recursive: true });
  }
  
  // get the file path based on the model id
  toRelativePath(id) {
    return `${this.cachePath}/${id}.json`;
  }

  writeModelToDisk(cacheEntry) {
    const id = cacheEntry.id;
    const writePath = this.toRelativePath(id);
    const data = JSON.stringify(cacheEntry);
    fs.writeFileSync(writePath, data, 'utf8');
  }
  
  // read a model from the disk
  readJsonFile(id) {
    // read from the disk
    const readPath = this.toRelativePath(id);
    const options = {encoding: 'utf8', flag: 'r'};
    const data = fs.readFileSync(readPath, options);
    // parse the data 
    const {model, detector} = JSON.parse(data);
    const detectorData = detector.detector.data;
    const correlatedPairs = detector.detector.correlatedPairs;
    const anomalyModel = new AnomalyModel(model.type, detectorData, correlatedPairs);
    // return a cacheEntry json 
    return {id: id, model: model, detector: anomalyModel};
  }

  getFromMemory(id) {
    return this.cache.find((entry) => entry.id === id);
  }

  getFromDisk(id) {
    // load a model from the disk if it exists
    const readPath = this.toRelativePath(id);
    if (fs.existsSync(readPath)) {
      return this.readJsonFile(id);
    }
    // return null if it doesn't exist
    return null;
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
    // if the model exists in the RAM - return it
    const mem = this.getFromMemory(id);
    if (mem != null) {
      return {model: mem.model, detector: mem.detector};
    }
    // else if the model exists on the disk - return it
    const disk = this.getFromDisk(id);
    if (disk != null) {
      return {model: disk.model, detector: disk.detector};
    }
    // otherwise, model doesn't exist
    return null;
  }

  deleteFromDisk(id) {
    // delete the file if it exists
    const filePath = this.toRelativePath(id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = CacheHandler;