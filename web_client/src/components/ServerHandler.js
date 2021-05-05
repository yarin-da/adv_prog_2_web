/* inner implementation */
const server = "http://localhost:9876";

const httpGETModels = async () => {
  const response = await fetch(`${server}/api/models`);
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  return {};
}

const httpGETModel = async (model_id) => {
  const response = await fetch(`${server}/api/model?model_id=${model_id}`);
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  return {};
}

const httpPOSTModel = async (model_type, data) => {
  const response = await fetch(
      `${server}/api/model?model_type=${model_type}`, 
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({train_data: data}),
      }
  );
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  return {};
}

const httpDELETEModel = async (model_id) => {
  const response = await fetch(
      `${server}/api/model?model_id=${model_id}`, 
      {
          method: 'DELETE',
      }
  );
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  return {};
}

const httpPOSTAnomalies = async (model_id, data) => {
  const response = await fetch(
      `${server}/api/anomaly?model_id=${model_id}`, 
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({predict_data: data}),
      }
  );
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  return {};
}

/* data converters */
const flightDataToServerData = (flightData) => {
  // return if there's no data
  if (flightData == null || flightData[0] == null) { return; }
  // initialize a new json object 
  const serverData = {};
  // initialize keys
  const columns = Object.keys(flightData[0]);
  columns.forEach((col) => {
    serverData[col] = [];
  });
  // initialize arrays for each key (column)
  for (let i = 0; i < flightData.length; i++) {
    columns.forEach((col) => {
      serverData[col] = [...serverData[col], flightData[col][i]];
    });
  }
  return serverData;
}


/* http calls wrappers */
const getModels = async (func) => {
  const json = await httpGETModels();
  func(json);
};

const getModel = async (model_id, func) => {
  const json = await httpGETModel(model_id);
  func(json);
};

const postModel = async (model_id, data, func) => {
  const convertedData = flightDataToServerData(data);
  const json = await httpPOSTModel(model_id, convertedData);
  func(json);
};

const deleteModel = async (model_id, func) => {
  const json = await httpDELETEModel(model_id);
  func(json);
};

const postAnomalies = async (model_id, data, func) => {
  const convertedData = flightDataToServerData(data);
  const json = await httpPOSTAnomalies(model_id, convertedData);
  func(json);
};

/* server communication interface */
const ServerHandler = {
  getModels: getModels,
  getModel: getModel,
  postModel: postModel,
  deleteModel: deleteModel,
  postAnomalies: postAnomalies,
}
export default ServerHandler;