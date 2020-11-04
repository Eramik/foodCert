// The DataController module implements API to interact with database.

const logger = require('./utils/Logger');
try {
  const mongoose = require('mongoose');

  const cfg = require('../../config/default');

 

  mongoose.connect(cfg.mongodb.connectionURI, { useNewUrlParser: true }).then(
    () => { logger.info('Connected to mongoDB successfully') },
    err => { logger.error('Failed to connect to mongoDB: ', err) }
  );

  module.exports = {

  }
} catch (e) {
  logger.error('Unexpected error at ' + __filename + ': ', e);
}
