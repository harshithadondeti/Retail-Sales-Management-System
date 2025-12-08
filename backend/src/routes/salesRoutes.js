const router = require('express').Router();
const { getSales, getFilters } = require('../controllers/salesController');

router.get('/', getSales);
router.get('/filters', getFilters);

module.exports = router;