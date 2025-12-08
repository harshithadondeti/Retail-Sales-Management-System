// frontend/src/hooks/useSalesData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchSales,fetchFilterOptions } from '../services/salesService';

export const useSalesData = () => {
  
  
  // 1. STATE MANAGEMENT
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Total count from server

  // State for all UI controls (Search, Filters, Sort, Page)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Extended Filter State to cover all requirements
  const [filters, setFilters] = useState({
    region: "",
    gender: "",
    payment_method: "",
    category: "",
    tags: "",
    minAge: "",
    maxAge: "",
    startDate: "",
    endDate: "",
  });
  
  const [sort, setSort] = useState({ 
    field: 'date', 
    order: 'desc' 
  });

  // 2. DATA FETCHING (Server-Side Logic)
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Construct parameters object
      const params = {
        page,
        limit: 10,
        search,
        sortBy: sort.field,
        sortOrder: sort.order,
        ...filters
      };

      // 2. Remove any empty string parameters before sending to API
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      // 3. Call the real API
      const result = await fetchSales(params);
      
      // Update state from the server response
      setData(result.data);
      setTotal(result.pagination.totalItems); // Use the total items count for pagination
      
    } catch (err) {
      console.error("Failed to load sales data:", err);
      setError(err.message || "Failed to fetch data. Please check your backend.");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters, sort]);

  const [options, setOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    payments: [],
    tags: []
  });

  // 1. Fetch All Options on Mount
  useEffect(() => {
    const loadOptions = async () => {
      const data = await fetchFilterOptions();
      setOptions(data);
    };
    loadOptions();
  }, []);

  // Trigger fetch when dependencies change (with debounce for search)
  useEffect(() => {
    const timerId = setTimeout(() => {
      loadData();
    }, 500); // Debounce delay

    return () => clearTimeout(timerId);
  }, [loadData]);

  // 3. HANDLERS (Minimal changes, mostly just passing new states)
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1); // Reset page on new search
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset page on filter change
  };

  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      order: prevSort.field === field && prevSort.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    // Data State
    data, loading, error, total,
    // UI State
    page, search, filters, sort,
    options,
    // Actions
    handlePageChange, handleSearch, handleFilterChange, handleSortChange
  };
};