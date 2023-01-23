
const express = require('express')
const app = express()
const port = 4000
const hostname = '127.0.0.1'

const logger = require('./logger');

app.get('/error', (req, res) => {
  res.send('Hello World!');
  req.headers['X-Amzn-Trace-Id'] = 'Root=1-63441c4a-abcdef012345678912345678';
  logger.error({
    msg: 'error',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.get('/warn', (req, res) => {
  res.send('Hello World!');
  logger.warn({
    msg: 'warn',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.get('/info', (req, res) => {
  res.send('Hello World!');
  logger.info({
    msg: 'info',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.get('/http', (req, res) => {
  res.send('Hello World!');
  logger.http({
    msg: 'verbose error',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.get('/verbose', (req, res) => {
  res.send('Hello World!');
  logger.verbose({
    msg: 'http',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.get('/debug', (req, res) => {
  res.send('Hello World!');
  logger.debug({
    msg: 'debug',
    tag: 'tag',
    data: 'data',
    req: req
  });
})
app.get('/silly', (req, res) => {
  res.send('Hello World!');
  logger.silly({
    msg: 'silly',
    tag: 'tag',
    data: 'data',
    req: req
  });
})

app.listen(port, hostname);