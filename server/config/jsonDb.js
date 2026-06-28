const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'employees.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const generateId = () => {
  return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const getSeedData = () => {
  return [
    {
      _id: generateId(),
      name: 'Sarah Connor',
      email: 'sarah.connor@technova.com',
      phone: '5551234567',
      department: 'Engineering',
      role: 'Senior Frontend Architect',
      salary: 95000,
      joinDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'John Doe',
      email: 'john.doe@technova.com',
      phone: '5559876543',
      department: 'Engineering',
      role: 'Backend Software Engineer',
      salary: 82000,
      joinDate: new Date('2024-03-15').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Emily Watson',
      email: 'emily.watson@technova.com',
      phone: '5552345678',
      department: 'Human Resources',
      role: 'HR Manager',
      salary: 75000,
      joinDate: new Date('2023-11-01').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Michael Scott',
      email: 'michael.scott@technova.com',
      phone: '5558765432',
      department: 'Sales',
      role: 'Regional Sales Director',
      salary: 90000,
      joinDate: new Date('2022-05-10').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Pam Beesly',
      email: 'pam.beesly@technova.com',
      phone: '5553456789',
      department: 'Human Resources',
      role: 'HR Coordinator',
      salary: 50000,
      joinDate: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'David Lightman',
      email: 'david.lightman@technova.com',
      phone: '5557654321',
      department: 'Engineering',
      role: 'Security Consultant',
      salary: 110000,
      joinDate: new Date('2025-01-20').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Jane Foster',
      email: 'jane.foster@technova.com',
      phone: '5554567890',
      department: 'Product',
      role: 'Senior Product Manager',
      salary: 105000,
      joinDate: new Date('2024-08-12').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Tony Stark',
      email: 'tony.stark@technova.com',
      phone: '5556543210',
      department: 'Engineering',
      role: 'Chief Technology Officer',
      salary: 250000,
      joinDate: new Date('2021-02-15').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Natasha Romanoff',
      email: 'natasha.romanoff@technova.com',
      phone: '5555678901',
      department: 'Marketing',
      role: 'Brand Campaign Lead',
      salary: 80000,
      joinDate: new Date('2023-04-18').toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: generateId(),
      name: 'Bruce Banner',
      email: 'bruce.banner@technova.com',
      phone: '5554321098',
      department: 'Product',
      role: 'Research Scientist',
      salary: 120000,
      joinDate: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
};

const readDb = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const seed = getSeedData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
      return seed;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON database:', error);
    return [];
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to JSON database:', error);
  }
};

const getAllEmployees = async ({ search, sortBy, order, page = 1, limit = 10 }) => {
  let employees = readDb();

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    employees = employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.role.toLowerCase().includes(searchLower)
      );
    });
  }

  // Sort
  if (sortBy) {
    const isDesc = order === 'desc';
    employees.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle cases
      if (sortBy === 'salary') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortBy === 'joinDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });
  } else {
    // Default newest first
    employees.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination
  const total = employees.length;
  const currentPage = parseInt(page);
  const maxLimit = parseInt(limit);
  const skip = (currentPage - 1) * maxLimit;
  const paginatedData = employees.slice(skip, skip + maxLimit);

  return {
    data: paginatedData,
    pagination: {
      total,
      page: currentPage,
      limit: maxLimit,
      pages: Math.ceil(total / maxLimit),
    },
  };
};

const getEmployeeById = async (id) => {
  const employees = readDb();
  return employees.find((emp) => emp._id === id) || null;
};

const getEmployeeByEmail = async (email) => {
  const employees = readDb();
  return employees.find((emp) => emp.email.toLowerCase() === email.toLowerCase()) || null;
};

const createEmployee = async (employeeData) => {
  const employees = readDb();
  const newEmployee = {
    _id: generateId(),
    ...employeeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  employees.push(newEmployee);
  writeDb(employees);
  return newEmployee;
};

const updateEmployee = async (id, employeeData) => {
  const employees = readDb();
  const index = employees.findIndex((emp) => emp._id === id);
  if (index === -1) return null;

  employees[index] = {
    ...employees[index],
    ...employeeData,
    updatedAt: new Date().toISOString(),
  };
  writeDb(employees);
  return employees[index];
};

const deleteEmployee = async (id) => {
  const employees = readDb();
  const filtered = employees.filter((emp) => emp._id !== id);
  writeDb(filtered);
  return true;
};

const getDashboardStats = async () => {
  const employees = readDb();
  const totalEmployees = employees.length;

  // Unique departments
  const uniqueDepts = [...new Set(employees.map((emp) => emp.department))];
  const departmentsCount = uniqueDepts.length;

  // Average Salary
  const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
  const averageSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;

  // New Hires in current calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const newEmployeesThisMonth = employees.filter((emp) => {
    const joinDate = new Date(emp.joinDate);
    return joinDate >= startOfMonth && joinDate <= endOfMonth;
  }).length;

  return {
    totalEmployees,
    departmentsCount,
    averageSalary,
    newEmployeesThisMonth,
  };
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
};
