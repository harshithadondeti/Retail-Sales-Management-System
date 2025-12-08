import React from 'react';
import { useSalesData } from '../hooks/useSalesData';
import SalesTable from '../components/SalesTable';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import StatsCards from '../components/StatsCards';

const Dashboard = () => {
  const {
    data, loading, total, page, filters, sort,
    handlePageChange, handleSearch, handleFilterChange, handleSortChange
  } = useSalesData();

  return (
    <div className="dashboard-container">
      
      {/* 1. TOP HEADER: Title + Search  */}
      <header className="dashboard-header">
        <h1>Sales Management System</h1>
        <div className="header-search">
           <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* 2. TOOLBAR: Filters + Sort  */}
      <div className="toolbar-row">
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        
        {/* Sort Dropdown - Figma Style */}
        <div className="sort-control">
            <span>Sort by:</span>
            <select 
                value={sort.field} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
            >
                <option value="date">Date</option>
                <option value="customer_name">Customer Name</option>
                <option value="quantity">Quantity</option>
                {/* Removed "Amount" option as requested */}
            </select>
        </div>
      </div>

      {/* 3. STATS CARDS  */}
      <StatsCards data={data} />

      {/* 4. TABLE CONTENT */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : data.length === 0 ? (
        // --- HANDLING NO RESULTS / CONFLICTING FILTERS ---
        <div className="no-results-state">
           <div className="empty-icon">🔍</div>
           <h3>No results found</h3>
           <p>
             We couldn't find any sales matching your filters. <br/>
             Try adjusting your search or clearing some filters.
           </p>
           <button 
             className="reset-btn"
             onClick={() => handleFilterChange({})}
           >
             Clear All Filters
           </button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <SalesTable data={data} sort={sort} onSort={handleSortChange} />
          </div>
          <Pagination 
            currentPage={page} 
            totalItems={total} 
            itemsPerPage={10} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;