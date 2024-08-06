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
  user: 'user',
  host: 'host',
  database: 'banque',
  password: 'pass',
  port: 5432,
});

// Home route
app.get('/',async (req, res) => {
  res.send("<h1>hello server is running</h1>");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

// Route to get all users
app.get('/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.send(users = result.rows );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });