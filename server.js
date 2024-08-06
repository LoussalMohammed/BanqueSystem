const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'BanqueSystem',
  password: 'superman',
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
      const users = result.rows;
      res.render('users', {users: users, title: 'Page Users'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  
app.get('/signUp', (req, res) => {
    res.render('signup', {title: 'signup', css: './css/auth.css'});
});

app.post('/signupAction', async (req, res) => {
        const { username, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            'INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4)',
            [username, email, phone, hashedPassword]
        );
        res.redirect('/roles');
    } catch(err) {
        console.error(err.message);
    }

});

app.get('/roles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles');
        const roles = result.rows;
        res.render('roles', {roles: roles, title: 'Page Roles'});
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    
});

app.post('/editRole', async (req, res) => {
    try {
        const { id, newName } = req.body;
        await pool.query('UPDATE roles SET name = ($1) WHERE id = ($2)', [newName, id])
        .then(() => {
            res.redirect('/roles');
        });
    } catch(err) {
        console.error(err.message);
    }
});

app.post('/addRole', async (req, res) => {
    let role = req.body.role;
    try {
        await pool.query(`INSERT INTO ROLES (name) VALUES ($1)`, [role]);
        res.redirect('/roles');
    } catch(err) {
        console.log(err.message);
    }
});

app.post('/deleteRole', async (req, res) => {
    const id = req.body.id;
    try {
        await pool.query('DELETE FROM roles WHERE id = ($1)', [id]);
        res.redirect('/roles');
    } catch(err) {
        console.log(err.message);
    }
});

app.use((req, res) => {
    res.status(404).render('404', {title: 404})
});