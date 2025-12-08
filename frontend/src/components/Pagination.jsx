import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  // Logic to determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    // If we have few pages (<= 7), show all of them
    if (totalPages <= 7) {
       for (let i = 1; i <= totalPages; i++) pages.push(i);
       return pages;
    }

    // Always show the first page
    pages.push(1);

    // Calculate dynamic window around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we are near the beginning (e.g. page 1, 2, 3)
    if (currentPage <= 3) {
      endPage = 4;
    }
    
    // Adjust if we are near the end
    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
    }

    // Add ellipsis before the window
    if (startPage > 2) {
      pages.push('...');
    }

    // Add the window of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis after the window
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show the last page
    pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button 
        className="pagination-btn nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button 
        className="pagination-btn nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;