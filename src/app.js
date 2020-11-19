// Main file.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const config = require('../config/default');
const mongoose = require('mongoose');
const runScratchpad = require('./utils/dataSampler');

// Init logger.
const logger = require('./utils/Logger');

async function runServer() {
  try {
    await mongoose.connect(config.mongodb.connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    logger.info('Databse connected.');
  } catch (e) {
    logger.error('Error during connecting to database:');
    logger.error(e);
  }

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const AuthHandler = require('./endpoints/auth');
  const CertificatesHandler = require('./endpoints/certificates');
  const UserDataHandler = require('./endpoints/userData');
  const TemperatureMapReceiver = require('./endpoints/temperatureMapReceiver');

  AuthHandler(app);
  CertificatesHandler(app);
  UserDataHandler(app);
  TemperatureMapReceiver(app);

  const port = 3333;

  app.listen(port, () => console.log(`Аpp listening on port ${port}!`));
  
  //runScratchpad(false);
};
runServer();
