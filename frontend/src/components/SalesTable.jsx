import React from 'react';

// Helper: Safely render any value, defaulting to '-' if missing
const safeRender = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
  } catch (e) { return '-'; }
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount).replace('₹', '₹ ');
};

const SalesTable = ({ data }) => {
  const columns = [
    { key: 'transaction_id', label: 'Transaction ID', width: '120px' },
    { key: 'date', label: 'Date', width: '110px' },
    { key: 'customer_id', label: 'Customer ID', width: '110px' },
    { key: 'customer_name', label: 'Customer Name', width: '150px' },
    { key: 'phone_number', label: 'Phone Number', width: '140px' },
    { key: 'gender', label: 'Gender', width: '80px' },
    { key: 'age', label: 'Age', width: '60px' },
    { key: 'product_category', label: 'Product Category', width: '140px' },
    { key: 'quantity', label: 'Quantity', width: '80px' },
    { key: 'total_amount', label: 'Total Amount', width: '120px' },
    { key: 'customer_region', label: 'Customer Region', width: '130px' },
    { key: 'product_id', label: 'Product ID', width: '110px' },
    { key: 'employee_name', label: 'Employee Name', width: '150px' },
  ];

  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ minWidth: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.transaction_id || index}>
              <td className="text-secondary">{safeRender(row.transaction_id)}</td>
              <td className="text-secondary">{formatDate(row.date)}</td>
              <td className="text-secondary">{safeRender(row.customer_id)}</td>
              <td className="font-medium">{safeRender(row.customer_name)}</td>
              <td className="text-secondary">{safeRender(row.phone_number)}</td>
              <td className="text-secondary">{safeRender(row.gender)}</td>
              <td className="text-secondary">{safeRender(row.age)}</td>
              <td className="font-medium">{safeRender(row.product_category)}</td>
              <td style={{ textAlign: 'center' }}>
                {row.quantity ? String(row.quantity).padStart(2, '0') : '-'}
              </td>
              <td className="font-bold">{formatCurrency(row.total_amount)}</td>
              <td className="text-secondary">{safeRender(row.customer_region)}</td>
              <td className="text-secondary">{safeRender(row.product_id)}</td>
              <td className="text-secondary">{safeRender(row.employee_name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;