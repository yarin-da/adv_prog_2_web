const CacheHandler = require('./CacheHandler');

class Database {
  constructor() {
    this.cacheHandler = new CacheHandler();
    this.models = [];
  }

  add(anomalyModel, id, type, upload_time) {
    const model = {
      model_id: id,
      model_type: type,
      upload_time: upload_time,
      status: "pending",
    };
    this.cacheHandler.add(id, model, anomalyModel);
    this.models.push(model);
  }

  get(id) {
    return this.cacheHandler.get(id);
  }

  getIndex(id) {
    return this.models.findIndex((model) => model.model_id === id);
  }

  delete(id) {
    const index = this.getIndex(id);
    if (index !== -1) {
      this.models.splice(index, 1);
      this.cacheHandler.deleteFromDisk(id);
    }
  }
}

module.exports = Database;