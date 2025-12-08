// frontend/src/services/salesService.js
import axios from 'axios';

// Ensure this matches your backend URL. If running locally, it's typically 5000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/sales';

/**
 * Fetches sales data from the backend, applying server-side pagination, 
 * search, filters, and sorting.
 * @param {object} params - All query parameters (page, search, region, minAge, etc.)
 */
export const fetchSales = async (params) => {
  try {
    // Axios serializes the 'params' object into a clean URL query string 
    // (e.g., ?page=1&search=John&region=North)
    const response = await axios.get(API_URL, { params });
    
    // The backend now returns { data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    console.error("API Error during data fetch:", error);
    // Throw a consistent error message for the hook to catch
    throw new Error(error.response?.data?.message || 'Failed to connect to the server.');
  }
};


export const fetchFilterOptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/filters`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
    // Return safe defaults if API fails
    return {
      regions: [],
      genders: [],
      categories: [],
      payments: [],
      tags: []
    };
  }
};