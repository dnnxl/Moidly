const Joi = require('joi');
const helmet = require('helmet')
const morgan = require('morgan');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());

app.use('/api/genres', genres);

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  startupDebugger('Enviroment ' + app.get('env'));
  startupDebugger('Morgan enabled ...');
  startupDebugger('Application Name: ' + config.get('name'));

}

// For database
dbDebugger('Connected to the databse ...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));