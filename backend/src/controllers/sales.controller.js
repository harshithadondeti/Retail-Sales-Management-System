const { getSales } = require("../services/sales.service");

exports.getSalesController = async (req, res) => {
  try {
    const data = await getSales(req.query);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getSalesController:", error.message);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
};
