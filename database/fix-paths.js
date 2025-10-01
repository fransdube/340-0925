const pool = require('./index');

async function fixPaths() {
  try {
    const sql = "UPDATE inventory SET inv_image = REPLACE(inv_image, '/images/vehicles/vehicles/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/vehicles/vehicles/', '/images/vehicles/')";
    await pool.query(sql);
    console.log('Image paths fixed successfully.');
  } catch (error) {
    console.error('Error fixing image paths:', error);
  } finally {
    pool.end();
  }
}

fixPaths();