const { Semaphore } = require('await-semaphore')
const Database = require('./Database');
const Generator = require('./Generator');
const AnomalyModel = require('./anomaly_detection/AnomalyModel');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// enable cors (to allow our site's requests)
app.use(cors());
app.options('*', cors());

const port = 9876;
const idGenerator = new Generator();
const database = new Database();

const maxLearnOperations = 20;
const semaphore = new Semaphore(maxLearnOperations);

async function notifyLearn(model, anomalyModel) {
  const release = await semaphore.acquire();
  anomalyModel.learnNormal();
  model.status = 'ready';  
  release();
};

function getTimestamp() {
  const current = new Date();
  const year = current.getFullYear();
  const month = (current.getMonth() + 1).toString().padStart(2, '0');
  const day = current.getDate().toString().padStart(2, '0');
  const hour = current.getHours().toString().padStart(2, '0');
  const minute = current.getMinutes().toString().padStart(2, '0');
  const second = current.getSeconds().toString().padStart(2, '0');
  // getTimezoneOffset returns minutes, and negative values if timezone is ahead of UTC
  const offset = -1 * current.getTimezoneOffset() / 60;
  // add a plus sign if the offset is non-negative
  const plus = (offset >= 0) ? '+' : '';
  const date = `${year}-${month}-${day}`;
  const dayTime = `${hour}:${minute}:${second}`;
  const Z = `${plus}${offset}:00`;
  return `${date}T${dayTime}${Z}`
}

app.get('/', (req, res) => {
});

app.get('/api/models', (req, res) => {
  // send the whole database (convert from json first)
  const models = database.models;
  const data = JSON.stringify(models);
  res.send(data);
});

app.delete('/api/model', (req, res) => {
  const deleteID = parseInt(req.query.model_id);
  // get the index of the model we want to delete
  const {model} = database.get(deleteID);
  if (model == null) {
    // not found
    res.sendStatus(404);
  } else {
    // delete the element
    database.delete(deleteID);
    res.sendStatus(200);
  }
});

app.get('/api/model', (req, res) => {
  const id = req.query.model_id;
  const {model} = database.get(id);
  if (model == null) {
    // not found
    res.sendStatus(404);
  } else {
    // send the model to the client
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(model));
  }
});

app.post('/api/model', (req, res) => {
  const type = req.query.model_type;
  const trainData = req.body.train_data;
  // create anomaly model with trainData
  const anomalyModel = new AnomalyModel(type, trainData);
  const parity = (type !== 'regression') ? 1 : 0;
  const generatedID = 2 * idGenerator.next() + parity;
  const currTime = getTimestamp();
  database.add(anomalyModel, generatedID, type, currTime);
  const {model, detector} = database.get(generatedID);
  res.header("Content-Type",'application/json');
  const modelData = JSON.stringify(model);
  res.send(modelData);
  setTimeout(()=>{ notifyLearn(model, detector) }, 500);
});

app.post('/api/anomaly', (req, res) => {
  const id = parseInt(req.query.model_id);
  const cached = database.get(id);
  if (cached == null) {
    // not found
    res.sendStatus(404);
  } else {
    const {model, detector} = cached;
    if (model.status !== 'ready') {
      res.redirect(`/api/model?model_id=${id}`);
    } else {
      const detectData = req.body.predict_data;
      const anomalies = detector.getAnomalies(detectData);
      res.header("Content-Type",'application/json');
      res.send(JSON.stringify(anomalies));
    }
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

