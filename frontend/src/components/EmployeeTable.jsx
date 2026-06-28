import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const EmployeeTable = ({
  employees,
  pagination,
  onEdit,
  onDelete,
  sortBy,
  order,
  onSort,
  onPageChange,
  onLimitChange,
}) => {
  const handleSortClick = (columnKey) => {
    if (sortBy === columnKey) {
      // Toggle order
      onSort(columnKey, order === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending sort for new column
      onSort(columnKey, 'asc');
    }
  };

  const renderSortIcon = (columnKey) => {
    if (sortBy !== columnKey) return null;
    return order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const { page = 1, limit = 10, total = 0, pages = 1 } = pagination || {};

  // Compute records range details
  const startRange = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  // Generate page numbers to render
  const getPageNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= pages; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Users size={32} />
        </div>
        <h3>No employees found</h3>
        <p>Try adjusting your search terms or add a new employee record to populate the list.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSortClick('name')}>
                <div className="th-content">
                  <span>Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th className="sortable" onClick={() => handleSortClick('department')}>
                <div className="th-content">
                  <span>Department</span>
                  {renderSortIcon('department')}
                </div>
              </th>
              <th>Role</th>
              <th className="sortable" onClick={() => handleSortClick('salary')}>
                <div className="th-content">
                  <span>Salary</span>
                  {renderSortIcon('salary')}
                </div>
              </th>
              <th className="sortable" onClick={() => handleSortClick('joinDate')}>
                <div className="th-content">
                  <span>Join Date</span>
                  {renderSortIcon('joinDate')}
                </div>
              </th>
              <th>Phone</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <div className="emp-name-cell">
                    <span className="emp-name">{employee.name}</span>
                    <span className="emp-email">{employee.email}</span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-dept">{employee.department}</span>
                </td>
                <td>{employee.role}</td>
                <td>{formatCurrency(employee.salary)}</td>
                <td>{formatDate(employee.joinDate)}</td>
                <td>{employee.phone}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-buttons" style={{ justifyContent: 'center' }}>
                    <button
                      onClick={() => onEdit(employee)}
                      className="action-btn"
                      title="Edit employee details"
                      aria-label="Edit employee"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="action-btn delete"
                      title="Delete employee record"
                      aria-label="Delete employee"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <div className="pagination-info">
          Showing <span style={{ fontWeight: 600 }}>{startRange}</span> to{' '}
          <span style={{ fontWeight: 600 }}>{endRange}</span> of{' '}
          <span style={{ fontWeight: 600 }}>{total}</span> records
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Page Limit Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="filter-select"
              style={{ padding: '0.35rem 1.75rem 0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          {/* Page Buttons */}
          <div className="pagination-controls">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="page-btn"
              title="Previous Page"
            >
              &lt;
            </button>
            
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`page-btn ${page === num ? 'active' : ''}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === pages || pages === 0}
              className="page-btn"
              title="Next Page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
