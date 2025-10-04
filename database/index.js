const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object is needed for local development and production.
 * The original comment suggesting it would cause problems in production was incorrect
 * when using an external database URL.
 * *************** */
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

/* ***************
* Export Pool and query function
* The query function includes logging for debugging purposes.
* *************** */
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
  pool,
}