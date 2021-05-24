const CacheHandler = require('./CacheHandler');

class Database {
  constructor() {
    this.cacheHandler = new CacheHandler();
    this.models = [];
  }

  add(anomalyModel, id, type, upload_time) {
    // build the model json
    const model = {
      model_id: id,
      model_type: type,
      upload_time: upload_time,
      status: "pending",
    };
    // add it to the cache and the list
    this.cacheHandler.add(id, model, anomalyModel);
    this.models.push(model);
  }

  get(id) {
    // grab the model from the cache
    return this.cacheHandler.get(id);
  }

  getIndex(id) {
    // get the model with the provided id
    return this.models.findIndex((model) => model.model_id === id);
  }

  delete(id) {
    const index = this.getIndex(id);
    // delete the model with the provided id if it exists
    if (index !== -1) {
      this.models.splice(index, 1);
      this.cacheHandler.deleteFromDisk(id);
    }
  }
}

module.exports = Database;