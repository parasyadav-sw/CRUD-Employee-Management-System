const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validationMiddleware');

// Dashboard statistics (Must be defined BEFORE the ID routes to prevent it from matching as an ID parameter)
router.get('/dashboard/stats', getDashboardStats);

// Base employee routes
router.route('/')
  .get(getEmployees)
  .post(validateEmployee, createEmployee);

// Individual employee ID routes
router.route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
