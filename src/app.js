// Main file.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

// Init logger.
const logger = require('./utils/Logger');
// Init database controller.
logger.info('App started successfully.');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;

app.post('/search', (req, res) => {
  console.log('req started');
  let params = new SearchParams(req.body.searchData, req.body.resultsLimit);
  let r = searcher.search(params);
  res.send(r);
  console.log('Finished: ', r.length);
});



app.listen(port, () => console.log(`Аpp listening on port ${port}!`));