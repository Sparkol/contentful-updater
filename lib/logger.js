const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'test' ? 'crit' : 'verbose',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()]
  //silent: process.env.NODE_ENV === 'test' ? true : false
});

module.exports = logger;
