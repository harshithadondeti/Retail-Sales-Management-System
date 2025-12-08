import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value); 
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Customer Name or Phone..." 
        value={term}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;