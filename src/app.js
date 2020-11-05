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

import AuthHandler from './endpoints/auth';
import CertificatesHandler from './endpoints/certificates';

AuthHandler(app);
CertificatesHandler(app);

const port = 3000;

app.listen(port, () => console.log(`Аpp listening on port ${port}!`));