const salesService = require('../services/salesService');

const getSales = async (req, res) => {
  try {
    // Call Service
    const { rows, total } = await salesService.getSalesData(req.query);

    // Format Response
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: rows,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });

  } catch (err) {
    console.error("SALES CONTROLLER ERROR:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getSales };