const Employee = require('../models/employeeModel');
const jsonDb = require('../config/jsonDb');

// @desc    Get all employees with search, sorting, and pagination
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    if (global.useJsonDb) {
      const result = await jsonDb.getAllEmployees(req.query);
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
    const { search, sortBy, order, page = 1, limit = 10 } = req.query;

    // Build filter object for search
    const filter = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { role: searchRegex },
      ];
    }

    // Determine sorting options
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions['createdAt'] = -1; // Default: newest first
    }

    // Convert pagination values
    const currentPage = parseInt(page);
    const maxLimit = parseInt(limit);
    const skip = (currentPage - 1) * maxLimit;

    // Run query
    const totalEmployees = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(maxLimit);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total: totalEmployees,
        page: currentPage,
        limit: maxLimit,
        pages: Math.ceil(totalEmployees / maxLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee details
// @route   GET /api/employees/:id
// @access  Public
const getEmployeeById = async (req, res, next) => {
  try {
    if (global.useJsonDb) {
      const employee = await jsonDb.getEmployeeById(req.params.id);
      if (!employee) {
        res.status(404);
        throw new Error(`Employee with ID ${req.params.id} not found`);
      }
      return res.status(200).json({
        success: true,
        data: employee,
      });
    }
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error(`Employee with ID ${req.params.id} not found`);
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new employee record
// @route   POST /api/employees
// @access  Public
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, department, role, salary, joinDate } = req.body;

    if (global.useJsonDb) {
      const emailExists = await jsonDb.getEmployeeByEmail(email);
      if (emailExists) {
        res.status(400);
        throw new Error('An employee with this email address already exists');
      }

      const employee = await jsonDb.createEmployee({
        name,
        email,
        phone,
        department,
        role,
        salary,
        joinDate,
      });

      return res.status(201).json({
        success: true,
        message: 'Employee added successfully',
        data: employee,
      });
    }

    // Check if email already exists
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('An employee with this email address already exists');
    }

    const employee = await Employee.create({
      name,
      email,
      phone,
      department,
      role,
      salary,
      joinDate,
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Public
const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, department, role, salary, joinDate } = req.body;

    if (global.useJsonDb) {
      const employee = await jsonDb.getEmployeeById(req.params.id);

      if (!employee) {
        res.status(404);
        throw new Error(`Employee with ID ${req.params.id} not found`);
      }

      if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
        const emailExists = await jsonDb.getEmployeeByEmail(email);
        if (emailExists) {
          res.status(400);
          throw new Error('An employee with this email address already exists');
        }
      }

      const updatedEmployee = await jsonDb.updateEmployee(req.params.id, {
        name: name || employee.name,
        email: email || employee.email,
        phone: phone || employee.phone,
        department: department || employee.department,
        role: role || employee.role,
        salary: salary !== undefined ? salary : employee.salary,
        joinDate: joinDate || employee.joinDate,
      });

      return res.status(200).json({
        success: true,
        message: 'Employee details updated successfully',
        data: updatedEmployee,
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error(`Employee with ID ${req.params.id} not found`);
    }

    // Check if new email is taken by another employee
    if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('An employee with this email address already exists');
      }
    }

    // Update fields
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.department = department || employee.department;
    employee.role = role || employee.role;
    employee.salary = salary !== undefined ? salary : employee.salary;
    employee.joinDate = joinDate || employee.joinDate;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee details updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee record
// @route   DELETE /api/employees/:id
// @access  Public
const deleteEmployee = async (req, res, next) => {
  try {
    if (global.useJsonDb) {
      const employee = await jsonDb.getEmployeeById(req.params.id);

      if (!employee) {
        res.status(404);
        throw new Error(`Employee with ID ${req.params.id} not found`);
      }

      await jsonDb.deleteEmployee(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Employee record deleted successfully',
      });
    }
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error(`Employee with ID ${req.params.id} not found`);
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Employee record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/employees/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    if (global.useJsonDb) {
      const stats = await jsonDb.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    }
    const totalEmployees = await Employee.countDocuments();

    // Calculate unique departments count
    const uniqueDepartmentsResult = await Employee.distinct('department');
    const departmentsCount = uniqueDepartmentsResult.length;

    // Calculate average salary
    const avgSalaryResult = await Employee.aggregate([
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
        },
      },
    ]);
    const averageSalary = avgSalaryResult.length > 0 ? Math.round(avgSalaryResult[0].avgSalary) : 0;

    // Calculate new hires in the current calendar month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of current month
    endOfMonth.setHours(23, 59, 59, 999);

    const newEmployeesCount = await Employee.countDocuments({
      joinDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        departmentsCount,
        averageSalary,
        newEmployeesThisMonth: newEmployeesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
};
