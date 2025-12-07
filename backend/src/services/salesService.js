const pool = require('../config/db');

const getSalesData = async ({ 
  page = 1, limit = 10, search = "", sortBy = "date", sortOrder = "desc",
  region, gender, payment_method, category, tags, minAge, maxAge, startDate, endDate 
}) => {
  
  // BUILD DYNAMIC WHERE CLAUSE
  const params = [];
  let paramIndex = 1;
  const whereClauses = [];

  //  Search 
  if (search) {
    whereClauses.push(`(customer_name ILIKE $${paramIndex} OR phone_number ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  //  Multi-Select Filters Helper 
  const addFilter = (field, column) => {
    if (field) {
      const values = Array.isArray(field) ? field : field.split(',');
      const placeholders = values.map(() => `$${paramIndex++}`).join(', ');
      whereClauses.push(`${column} IN (${placeholders})`);
      params.push(...values);
    }
  };

  addFilter(region, 'customer_region');
  addFilter(gender, 'gender');
  addFilter(payment_method, 'payment_method');
  addFilter(category, 'product_category');

  //  Tags (Fuzzy Match) 
  if (tags) {
    const tagValues = Array.isArray(tags) ? tags : tags.split(',');
    const tagConditions = tagValues.map(() => `tags ILIKE $${paramIndex++}`);
    whereClauses.push(`(${tagConditions.join(' OR ')})`);
    tagValues.forEach(tag => params.push(`%${tag}%`));
  }

  //  Ranges 
  if (minAge) { whereClauses.push(`age >= $${paramIndex++}`); params.push(minAge); }
  if (maxAge) { whereClauses.push(`age <= $${paramIndex++}`); params.push(maxAge); }
  if (startDate) { whereClauses.push(`date >= $${paramIndex++}`); params.push(startDate); }
  if (endDate) { whereClauses.push(`date <= $${paramIndex++}`); params.push(endDate); }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // SORTING SECURITY
  const sortMap = { date: 'date', quantity: 'quantity', customer_name: 'customer_name' };
  const dbSortField = sortMap[sortBy] || 'date';
  const dbSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  //  PAGINATION
  const limitVal = parseInt(limit);
  const offset = (parseInt(page) - 1) * limitVal;

  //  EXECUTE QUERIES
  const dataQuery = `
    SELECT * FROM sales
    ${whereSQL}
    ORDER BY ${dbSortField} ${dbSortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  const countQuery = `SELECT COUNT(*) FROM sales ${whereSQL}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [...params, limitVal, offset]),
    pool.query(countQuery, params)
  ]);

  return {
    rows: dataResult.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

module.exports = { getSalesData };