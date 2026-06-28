import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { employeeAPI } from '../services/api';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';

const EmployeeManagement = ({ triggerNotification }) => {
  // Data State
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Query Parameters State
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Immediate input value
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For Editing
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch employees list from API
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await employeeAPI.getAll({
        search,
        sortBy,
        order,
        page,
        limit,
      });

      if (response.success) {
        setEmployees(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      triggerNotification('Failed to load employee directory.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, sortBy, order, page, limit, triggerNotification]);

  // Trigger fetch when query params change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Debounced search trigger (updates 'search' state after user stops typing)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Sort change handler
  const handleSort = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1); // Reset to page 1
  };

  // Page limit change handler
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1
  };

  // Add employee trigger
  const handleAddClick = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  // Edit employee trigger
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  // Delete employee trigger
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleteLoading(true);
    try {
      const response = await employeeAPI.delete(employeeToDelete._id);
      if (response.success) {
        triggerNotification(response.message || 'Employee record deleted', 'success');
        setIsDeleteOpen(false);
        setEmployeeToDelete(null);
        // Refresh employee list
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      const msg = error.response?.data?.message || 'Failed to delete record. Try again.';
      triggerNotification(msg, 'error');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Success callback from form submission
  const handleFormSuccess = (msg) => {
    triggerNotification(msg, 'success');
    fetchEmployees();
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Employee Management</h1>
          <p>Create, update, and manage your employees records.</p>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Toolbar / Search / Filter */}
      <div className="toolbar">
        {/* Search Input */}
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, department, role..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Clear/Refresh Action */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(searchInput || sortBy !== 'createdAt') && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearch('');
                setSortBy('createdAt');
                setOrder('desc');
                setPage(1);
              }}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          )}
          <button
            onClick={fetchEmployees}
            className="btn btn-outline"
            title="Refresh directory"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {/* Table content / Loader */}
      {isLoading ? (
        <Spinner message="Loading employee directory..." />
      ) : (
        <EmployeeTable
          employees={employees}
          pagination={pagination}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Create/Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        employee={selectedEmployee}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message={
          employeeToDelete
            ? `Are you sure you want to delete the record for ${employeeToDelete.name}? This action cannot be undone and will permanently remove their records.`
            : ''
        }
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default EmployeeManagement;
