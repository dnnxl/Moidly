const helmet = require('helmet')
const morgan = require('morgan');
const winston = require('winston');
const express = require('express');
const app = express();
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Enviroment ' + app.get('env'));
  startupDebugger('Morgan enabled ...');
  startupDebugger('Application Name: ' + config.get('name'));
}

// For database
dbDebugger('Connected to the databse ...');

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));