const pool = require("../database/")

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO reviews (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all reviews for a specific inventory item
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname
       FROM public.reviews AS r
       JOIN public.account AS a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getreviewsbyinventoryid error " + error)
  }
}

module.exports = { addReview, getReviewsByInventoryId };