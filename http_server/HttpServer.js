const { Semaphore } = require('await-semaphore')
const Database = require('./Database');
const Generator = require('./Generator');
const AnomalyModel = require('./anomaly_detection/AnomalyModel');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// used to send website-related files to the client
app.use(express.static(path.join(__dirname, 'public')));
// support huge json files
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// enable cors (to allow clients' requests on different domains)
app.use(cors());
app.options('*', cors());

const port = 9876;
const idGenerator = new Generator();
const database = new Database();

// allow maximum 20 concurrent learnNormal requests
const maxLearnOperations = 20;
const semaphore = new Semaphore(maxLearnOperations);

// wrap a learnNormal request in an async function
async function notifyLearn(model, anomalyModel) {
  // use the semaphore to limit concurrent requests
  const release = await semaphore.acquire();
  anomalyModel.learnNormal();
  model.status = 'ready';  
  release();
};

// get the current time
// parsed according to the API
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

// send the website
app.get('/', (req, res) => {
});

// send all the models in our database to the client
app.get('/api/models', (req, res) => {
  // send the whole database (convert from json first)
  const models = database.models;
  const data = JSON.stringify(models);
  res.send(data);
});

// delete a model from our database
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

// send a model to the client based on id
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

// get a new model from the client
// and add it to the database
app.post('/api/model', (req, res) => {
  // fetch the parameters
  const type = req.query.model_type;
  const trainData = req.body.train_data;

  // create anomaly model with trainData
  const anomalyModel = new AnomalyModel(type, trainData);
  
  // generate a unique id
  // make the id odd/even based on the type
  const parity = (type !== 'regression') ? 1 : 0;
  const generatedID = 2 * idGenerator.next() + parity;
  
  // get a current timestamp
  const currTime = getTimestamp();
  // add the model to the database
  database.add(anomalyModel, generatedID, type, currTime);
  const {model, detector} = database.get(generatedID);

  // send the new model as json
  res.header("Content-Type",'application/json');
  const modelData = JSON.stringify(model);
  res.send(modelData);

  // make sure to call learnNormal in the background
  setTimeout(()=>{ notifyLearn(model, detector) }, 500);
});

// send the client all the anomalies
app.post('/api/anomaly', (req, res) => {
  // fetch parameters
  const id = parseInt(req.query.model_id);

  // make sure the model exists
  const cached = database.get(id);
  if (cached == null) {
    // not found
    res.sendStatus(404);
  } else {
    const {model, detector} = cached;
    // make sure the model is ready
    if (model.status !== 'ready') {
      res.redirect(`/api/model?model_id=${id}`);
    } else {
      // calculate and fetch the anomalies
      const detectData = req.body.predict_data;
      const anomalies = detector.getAnomalies(detectData);

      // send anomalies as json to the client
      res.header("Content-Type",'application/json');
      res.send(JSON.stringify(anomalies));
    }
  }
});

// start the server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

