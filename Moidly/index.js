const mongoose = require('mongoose');
const Joi = require('joi');
const helmet = require('helmet')
const morgan = require('morgan');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
Joi.objectId = require('joi-objectid')(Joi);

const customers = require('./routes/customers');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');

mongoose.connect('mongodb://localhost/moidly')
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.error('Could not connect to MongoDB'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());

app.use('/api/genres', genres);
app.use('/api/customers', customers);

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