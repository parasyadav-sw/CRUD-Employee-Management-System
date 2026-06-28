import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { employeeAPI } from '../services/api';
import { formatDateForInput } from '../utils/formatters';

const EmployeeFormModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const isEditMode = !!employee;

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    salary: '',
    joinDate: '',
  });

  // Validation & Loading State
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prepopulate form if in edit mode
  useEffect(() => {
    if (isEditMode && employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        role: employee.role || '',
        salary: employee.salary !== undefined ? employee.salary : '',
        joinDate: formatDateForInput(employee.joinDate),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        salary: '',
        joinDate: formatDateForInput(new Date()), // Default to today
      });
    }
    setErrors({});
    setSubmitError('');
  }, [employee, isEditMode, isOpen]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Perform Client-side validations
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        newErrors.phone = 'Phone number must contain between 7 and 15 digits';
      }
    }

    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.role.trim()) newErrors.role = 'Job role is required';

    if (formData.salary === '') {
      newErrors.salary = 'Salary is required';
    } else {
      const numSalary = Number(formData.salary);
      if (isNaN(numSalary)) {
        newErrors.salary = 'Salary must be a number';
      } else if (numSalary < 0) {
        newErrors.salary = 'Salary must be a positive number';
      }
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    } else if (isNaN(Date.parse(formData.joinDate))) {
      newErrors.joinDate = 'Please enter a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      let result;
      if (isEditMode) {
        result = await employeeAPI.update(employee._id, payload);
      } else {
        result = await employeeAPI.create(payload);
      }

      if (result.success) {
        onSuccess(
          isEditMode ? 'Employee updated successfully' : 'Employee added successfully',
          'success'
        );
        onClose();
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Server connection error. Please try again later.';
      setSubmitError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? 'Edit Employee Details' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="close-btn" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {submitError && (
              <div className="form-summary-error">
                <AlertCircle size={16} />
                <span>{submitError}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group full-width">
                <label className="form-label required" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  disabled={isLoading}
                />
                {errors.name && <div className="form-error-msg">{errors.name}</div>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label required" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john.doe@technova.com"
                  disabled={isLoading}
                />
                {errors.email && <div className="form-error-msg">{errors.email}</div>}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label required" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 5551234567"
                  disabled={isLoading}
                />
                {errors.phone && <div className="form-error-msg">{errors.phone}</div>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label required" htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className={`filter-select form-input ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isLoading}
                  style={{ width: '100%' }}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
                {errors.department && <div className="form-error-msg">{errors.department}</div>}
              </div>

              {/* Role/Job Title */}
              <div className="form-group">
                <label className="form-label required" htmlFor="role">Job Title</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className={`form-input ${errors.role ? 'error' : ''}`}
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  disabled={isLoading}
                />
                {errors.role && <div className="form-error-msg">{errors.role}</div>}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label required" htmlFor="salary">Annual Salary ($)</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  className={`form-input ${errors.salary ? 'error' : ''}`}
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 80000"
                  min="0"
                  disabled={isLoading}
                />
                {errors.salary && <div className="form-error-msg">{errors.salary}</div>}
              </div>

              {/* Join Date */}
              <div className="form-group">
                <label className="form-label required" htmlFor="joinDate">Join Date</label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  className={`form-input ${errors.joinDate ? 'error' : ''}`}
                  value={formData.joinDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.joinDate && <div className="form-error-msg">{errors.joinDate}</div>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Record' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
