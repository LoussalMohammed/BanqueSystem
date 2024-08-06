const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Set up EJS for templating
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'BanqueSystem',
  password: 'your_password',
  port: 5432,
});

// Home route
app.get('/', (req, res) => {
  res.render('index');
});