const logger = require('./logger');

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  console.error(error.message);
  return res.status(400).send(error.message);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}