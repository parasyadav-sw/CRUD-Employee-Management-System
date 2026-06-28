const validateEmployee = (req, res, next) => {
  const { name, email, phone, department, role, salary, joinDate } = req.body;

  const errors = [];

  // Required checks
  if (!name || String(name).trim() === '') errors.push('Name is required');
  if (!email || String(email).trim() === '') errors.push('Email is required');
  if (!phone || String(phone).trim() === '') errors.push('Phone number is required');
  if (!department || String(department).trim() === '') errors.push('Department is required');
  if (!role || String(role).trim() === '') errors.push('Job role is required');
  if (salary === undefined || salary === null) errors.push('Salary is required');
  if (!joinDate) errors.push('Join date is required');

  // Email format validation
  if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Salary verification (must be positive)
  if (salary !== undefined && salary !== null) {
    const numSalary = Number(salary);
    if (isNaN(numSalary)) {
      errors.push('Salary must be a numeric value');
    } else if (numSalary < 0) {
      errors.push('Salary must be a positive number');
    }
  }

  // Phone validation (simple regex checks digits length, e.g., 7 to 15 digits)
  if (phone) {
    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      errors.push('Phone number must contain between 7 and 15 digits');
    }
  }

  // Join Date validation
  if (joinDate) {
    const parsedDate = Date.parse(joinDate);
    if (isNaN(parsedDate)) {
      errors.push('Please enter a valid date');
    }
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }

  next();
};

module.exports = {
  validateEmployee,
};
