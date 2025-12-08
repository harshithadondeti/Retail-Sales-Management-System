import React, { useState, useEffect, useRef } from 'react';

// 1. ADDED MOCK TAGS HERE
const mockOptions = {
    regions: ['North', 'South', 'East', 'West','Central'],
    genders: ['Male', 'Female'],
    paymentMethods: ['Cash','Credit Card','Debit Card','Net Banking','UPI','Wallet'],
    categories: ['Electronics','Beauty', 'Clothing'],
    tags: ['accessories','beauty','casual','cotton','fashion','formal','fragrance-free','gadgets','makeup','organic','portable','skincare','smart','unisex','wireless']
};

// --- COMPONENT: MULTI-SELECT DROPDOWN ---
const MultiSelectPill = ({ label, name, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedValues = value ? value.split(',') : [];

  const toggleOption = (option) => {
    let newValues;
    if (selectedValues.includes(option)) {
      newValues = selectedValues.filter(v => v !== option);
    } else {
      newValues = [...selectedValues, option];
    }
    onChange({ target: { name, value: newValues.join(',') } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let displayText = label;
  if (selectedValues.length > 0) {
    if (selectedValues.length <= 2) {
      displayText = `${label}: ${selectedValues.join(', ')}`;
    } else {
      displayText = `${label}: ${selectedValues.length} selected`;
    }
  }

  return (
    <div className={`filter-group ${selectedValues.length > 0 ? 'active' : ''}`} ref={containerRef}>
      <div 
        className="custom-select-display" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        {displayText}
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {options.map(opt => {
            const isChecked = selectedValues.includes(opt);
            return (
              <div 
                key={opt} 
                className={`multiselect-option ${isChecked ? 'selected' : ''}`}
                onClick={() => toggleOption(opt)}
              >
                <div className={`checkbox-box ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <span>✓</span>}
                </div>
                <span className="option-label">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- MAIN PANEL ---
const FilterPanel = ({ filters = {}, onFilterChange }) => {
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const isActive = (key) => filters[key] && filters[key] !== "";

  return (
    <div className="filter-panel">
      
      <MultiSelectPill label="Region" name="region" value={filters.region || ""} options={mockOptions.regions} onChange={handleFilterChange} />
      <MultiSelectPill label="Gender" name="gender" value={filters.gender || ""} options={mockOptions.genders} onChange={handleFilterChange} />
      
      <div className={`filter-group filter-range ${isActive('minAge') || isActive('maxAge') ? 'active' : ''}`}>
        <div className="range-pill">
            <span className="range-label">Age:</span>
            <input type="number" name="minAge" placeholder="Min" value={filters.minAge || ''} onChange={handleFilterChange} />
            <span className="range-sep">-</span>
            <input type="number" name="maxAge" placeholder="Max" value={filters.maxAge || ''} onChange={handleFilterChange} />
        </div>
      </div>

      <MultiSelectPill label="Category" name="category" value={filters.category || ""} options={mockOptions.categories} onChange={handleFilterChange} />

      {/* 2. REPLACED TEXT INPUT WITH MULTI-SELECT PILL */}
      <MultiSelectPill 
        label="Tags" 
        name="tags" 
        value={filters.tags || ""} 
        options={mockOptions.tags} 
        onChange={handleFilterChange} 
      />

      <MultiSelectPill label="Payment" name="payment_method" value={filters.payment_method || ""} options={mockOptions.paymentMethods} onChange={handleFilterChange} />
      
      <div className={`filter-group filter-range ${isActive('startDate') || isActive('endDate') ? 'active' : ''}`}>
         <div className="range-pill date-pill">
            <span className="range-label">Date:</span>
            <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; }}
                   name="startDate" placeholder="Start" value={filters.startDate || ''} onChange={handleFilterChange} />
            <span className="range-sep">-</span>
            <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; }}
                   name="endDate" placeholder="End" value={filters.endDate || ''} onChange={handleFilterChange} />
         </div>
      </div>

      <button className="clear-filters-btn" onClick={() => onFilterChange({})}>Clear All</button>
    </div>
  );
};

export default FilterPanel;