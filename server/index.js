const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/representatives/:state',
  findRepresentativesByState,
  jsonResponse
);

app.get('/senators/:state',
  findSenatorsByState,
  jsonResponse
);

async function findRepresentativesByState(req, res, next) {
  const url = `http://whoismyrepresentative.com/getall_reps_bystate.php?state=${req.params.state}&output=json`;
  axios.get(url).then(handleApiResponse(res, next));
}

function findSenatorsByState(req, res, next) {
  const url = `http://whoismyrepresentative.com/getall_sens_bystate.php?state=${req.params.state}&output=json`;
  axios.get(url).then(handleApiResponse(res, next)).catch(handleApiError(res, next));
}

function handleApiResponse(res, next) {
  return (response) => {
    res.locals = {
      success: true,
      results: response.data.results
    };
    return next();
  };
}

function jsonResponse(req, res, next) {
  return res.json(res.locals);
}

function handleApiError(res, next) {
  return (err) => {
    res.locals = {
      success: false,
      error: err || 'Invalid request. Please check your state variable.'
    };
    return next();
  };
}

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log('API listening at http://localhost:%s', port);
});