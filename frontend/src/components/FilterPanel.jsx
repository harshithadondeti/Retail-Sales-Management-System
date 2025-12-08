import React, { useState, useEffect, useRef } from 'react';

// --- COMPONENT: MULTI-SELECT DROPDOWN ---
const MultiSelectPill = ({ label, name, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle null/undefined value
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
const FilterPanel = ({ filters = {}, onFilterChange, options = {} }) => {
  
  // Safe defaults from dynamic options
  const {
    regions = [],
    genders = [],
    categories = [],
    payments = [],
    tags = []
  } = options;

  // Handler for MultiSelectPills
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  // Handler for Inputs (Age, Date) with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative numbers for Age
    if ((name === 'minAge' || name === 'maxAge') && value < 0) return;
    onFilterChange({ ...filters, [name]: value });
  };

  // Logic to Swap Min/Max if invalid on Blur (Click away)
  const handleBlur = () => {
    let newFilters = { ...filters };
    let changed = false;

    // Validate Age Range
    if (newFilters.minAge && newFilters.maxAge) {
      if (parseInt(newFilters.minAge) > parseInt(newFilters.maxAge)) {
        const temp = newFilters.minAge;
        newFilters.minAge = newFilters.maxAge;
        newFilters.maxAge = temp;
        changed = true;
      }
    }

    // Validate Date Range
    if (newFilters.startDate && newFilters.endDate) {
      if (new Date(newFilters.startDate) > new Date(newFilters.endDate)) {
        const temp = newFilters.startDate;
        newFilters.startDate = newFilters.endDate;
        newFilters.endDate = temp;
        changed = true;
      }
    }

    if (changed) onFilterChange(newFilters);
  };

  const isActive = (key) => filters[key] && filters[key] !== "";

  return (
    <div className="filter-panel">
      
      {/* Region */}
      <MultiSelectPill 
        label="Region" name="region" value={filters.region || ""} 
        options={regions} 
        onChange={handleFilterChange} 
      />

      {/* Gender */}
      <MultiSelectPill 
        label="Gender" name="gender" value={filters.gender || ""} 
        options={genders} 
        onChange={handleFilterChange} 
      />
      
      {/* Age Range */}
      <div className={`filter-group filter-range ${isActive('minAge') || isActive('maxAge') ? 'active' : ''}`}>
        <div className="range-pill">
            <span className="range-label">Age:</span>
            <input type="number" name="minAge" placeholder="Min" 
                   value={filters.minAge || ''} onChange={handleInputChange} onBlur={handleBlur} />
            <span className="range-sep">-</span>
            <input type="number" name="maxAge" placeholder="Max" 
                   value={filters.maxAge || ''} onChange={handleInputChange} onBlur={handleBlur} />
        </div>
      </div>

      {/* Category */}
      <MultiSelectPill 
        label="Category" name="category" value={filters.category || ""} 
        options={categories} 
        onChange={handleFilterChange} 
      />

      {/* Tags */}
      <MultiSelectPill 
        label="Tags" name="tags" value={filters.tags || ""} 
        options={tags} 
        onChange={handleFilterChange} 
      />

      {/* Payment */}
      <MultiSelectPill 
        label="Payment" name="payment_method" value={filters.payment_method || ""} 
        options={payments} 
        onChange={handleFilterChange} 
      />
      
      {/* Date Range */}
      <div className={`filter-group filter-range ${isActive('startDate') || isActive('endDate') ? 'active' : ''}`}>
         <div className="range-pill date-pill">
            <span className="range-label">Date:</span>
            <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; handleBlur(); }}
                   name="startDate" placeholder="Start" value={filters.startDate || ''} onChange={handleInputChange} />
            <span className="range-sep">-</span>
            <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; handleBlur(); }}
                   name="endDate" placeholder="End" value={filters.endDate || ''} onChange={handleInputChange} />
         </div>
      </div>

      <button className="clear-filters-btn" onClick={() => onFilterChange({})}>Clear All</button>
    </div>
  );
};

export default FilterPanel;