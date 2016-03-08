'use strict';

var winston = require('winston');

var logger = new winston.Logger({
    colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red'
    },
    transports: [
        new winston.transports.Console({
            level: 'debug',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
        }),
    ]
});

/*
logger.add(winston.transports.File, {
  prettyPrint: false,
  level: 'info',
  silent: false,
  colorize: true,
  timestamp: true,
  filename: './nKindler.log',
  maxsize: 40000,
  maxFiles: 10,
  json: false
});
*/

module.exports = logger;
/*
module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: 'somefile.log'
        })
    ]
});
*/
