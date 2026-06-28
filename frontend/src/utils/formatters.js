/**
 * Format a number as currency (e.g. $50,000)
 * @param {number} value - The salary amount to format
 * @returns {string} Formatted salary string
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date string into a readable date (e.g. Oct 24, 2026)
 * @param {string|Date} dateVal - The date value to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '-';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date string into YYYY-MM-DD for HTML5 date inputs
 * @param {string|Date} dateVal - The date value to format
 * @returns {string} Date string formatted as YYYY-MM-DD
 */
export const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
