import "./ServerTester.css";

const server = "http://localhost:9876"
const okResponse = 200;

const getModels = async () => {
  const response = await fetch(`${server}/api/models`);
  const status = await response.status;
  if (status === okResponse) {
    //const json = await response.json();
    //return json;
  }
  const text = await response.text();
  console.log(text);
}

const getModel = async (model_id) => {
  const response = await fetch(`${server}/api/model?model_id=${model_id}`);
  const status = await response.status;
  if (status === okResponse) {
    //const json = await response.json();
    //return json;
  }
  const text = await response.text();
  console.log(text);
}

const postModel = async (model_type, data) => {
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
  const status = await response.status;
  if (status === okResponse) {
    //const json = await response.json();
    //return json;
  }
  const text = await response.text();
  console.log(text);
}

const deleteModel = async (model_id) => {
  const response = await fetch(
      `${server}/api/model?model_id=${model_id}`, 
      {
          method: 'DELETE',
      }
  );
  const status = await response.status;
  if (status === okResponse) {
    //const json = await response.json();
    //return json;
  }

  const text = await response.text();
  console.log(text);
}

const postAnomalies = async (model_id, data) => {
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
  const status = await response.status;
  if (status === okResponse) {
    //const json = await response.json();
    //return json;
  }

  const text = await response.text();
  console.log(text);
}

const ServerTester = () => {
  const dummyPostData = {
    speed: [3, 5.36, 7, 8],
    rudder: [5, 9.345, 11, -3],
    pitch: [0.345, 0, 0, 0],
  };
  const dummyAnomalyData = {
    speed: [-3, -5.4534, -7.5453, -8],
    rudder: [-5.00001, -9.342, -1156.56, -3.5435],
    pitch: [0, 0, -0.3, 0],
  };

  /*************TESTS**************/
  const tests = [
    {
      testName: "GET /api/models",
      func: (id) => getModels(),
    },
    {
      testName: "GET /api/model",
      func: (id) => getModel(id),
    },
    {
      testName: "POST /api/model",
      func: (id) => postModel("regression", dummyPostData),
    },
    {
      testName: "DELETE /api/model",
      func: (id) => deleteModel(id),
    },
    {
      testName: "POST /api/anomaly",
      func: (id) => postAnomalies(id, dummyAnomalyData),
    },
  ];
  /************TESTS**************/
  
  const getDOMValue = (id) => {
    return document.getElementById(id).value;
  }

  const onClickCallback = (test, id) => {
    const func = test['func'];
    const value = getDOMValue(id);
    func(value);
  }

  return (
    <div className="Container">
      {tests.map((test, index) => {
        const inputID = `input-${index}`;
        return (
          <div 
            key={`Test-${index}`}
            className="Test">
            <input 
              id={inputID}
              placeholder={test['testName']}
              className="Input" />
            <button 
              onClick={() => onClickCallback(test, inputID)}
              className="Button">
                Send
            </button>
          </div>
        );
      }
        
      )}
    </div>
  );
};

export default ServerTester;