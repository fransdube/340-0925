const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sql = fs.readFileSync(path.join(__dirname, 'reviews.sql'), 'utf-8');

pool.query(sql, (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Reviews table created successfully');
  }
  pool.end();
});