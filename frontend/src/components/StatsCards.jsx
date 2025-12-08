import React from 'react';

const StatsCards = ({ data }) => {
  // Calculate stats from the *current page* data for demonstration.
  // In a real app, these usually come from a separate API endpoint (e.g., /api/stats)
  const totalUnits = data.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
  const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0);
  const totalDiscount = data.reduce((sum, item) => sum + (parseFloat(item.discount_percentage) || 0), 0); // Placeholder logic

  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-label">Total units sold ⓘ</span>
        <h3 className="stat-value">{totalUnits}</h3>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total Amount ⓘ</span>
        <h3 className="stat-value">₹{totalAmount.toLocaleString()}</h3>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total Discount ⓘ</span>
        <h3 className="stat-value">₹{totalDiscount.toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default StatsCards;