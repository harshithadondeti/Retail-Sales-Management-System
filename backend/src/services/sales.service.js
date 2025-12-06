const pool = require("../config/db");

exports.getSales = async (query) => {
  try {
    // Basic query for now (we will add filters, sorting, pagination later)
    const result = await pool.query(`SELECT * FROM sales LIMIT 10`);
    return result.rows;
  } catch (err) {
    console.error("SERVICE ERROR:", err);
    throw new Error("Database query failed: " + err.message);
  }
};
