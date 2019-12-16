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
const users = require('./routes/users');
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');


if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/moidly')
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.error('Could not connect to MongoDB'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Enviroment ' + app.get('env'));
  startupDebugger('Morgan enabled ...');
  startupDebugger('Application Name: ' + config.get('name'));
}

// For database
dbDebugger('Connected to the databse ...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));