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