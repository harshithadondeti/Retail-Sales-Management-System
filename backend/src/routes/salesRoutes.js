const router = require('express').Router();
const { getSales } = require('../controllers/salesController');

// GET /api/sales?page=1&search=John&region=North
router.get('/', getSales);

module.exports = router;