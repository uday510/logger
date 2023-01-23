const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const { createLogger, format } = winston;
const { combine, timestamp, label, printf } = format;
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

const datePatternConfiguration = {
  default: 'YYYY-MM-DD',
  everHour: 'YYYY-MM-DD-HH',
  everMinute: 'YYYY-MM-DD-THH-mm',
};

numberOfDaysToKeepLog = 30;
fileSizeToRotate = 1; // in megabyte

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateErrorFileTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: `${logDir}/%DATE%-error.log`,
  datePattern: datePatternConfiguration.everMinute,
  zippedArchive: true,
  maxSize: `${fileSizeToRotate}m`,
  maxFiles: `${numberOfDaysToKeepLog}d`
});

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-combined.log`,
  datePattern: datePatternConfiguration.everMinute,
  zippedArchive: true,
  maxSize: `${fileSizeToRotate}m`,
  maxFiles: `${numberOfDaysToKeepLog}d`
});

const printFormat = printf(({ level, message, label, timestamp }) => {
  const traceId = message.req.headers['X-Amzn-Trace-Id'] ? message.req.headers['X-Amzn-Trace-Id'] : '' ;
  return `${timestamp} [${label}] ${level}: ${message.msg} ${message.tag} ${message.data} ${message.req.method} ${message.req.path} ${message.req.socket.remoteAddress} ${traceId}`;
});

const transports = {
   console: new winston.transports.Console({
      level: 'silly', // prints all the logs
      handleExceptions: true,
      format: combine(
        label({ label: path.basename(module.parent.filename) }),
        format.colorize(),
        printFormat,
      )
    }),
    combinedFile: dailyRotateFileTransport,
    errorFile: dailyRotateErrorFileTransport
}

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  handleExceptions: true,
  format: format.combine(
    label({ label: path.basename(module.parent.filename) }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printFormat,
  ),
  transports: [
    transports.console,
    transports.combinedFile,
    transports.errorFile
  ],
});

module.exports = logger;
