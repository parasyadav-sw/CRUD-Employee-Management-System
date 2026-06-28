const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Employee = require('../models/employeeModel');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const employees = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@technova.com',
    phone: '5551234567',
    department: 'Engineering',
    role: 'Senior Frontend Architect',
    salary: 95000,
    joinDate: new Date(new Date().setDate(new Date().getDate() - 5)), // Joined 5 days ago (this month)
  },
  {
    name: 'John Doe',
    email: 'john.doe@technova.com',
    phone: '5559876543',
    department: 'Engineering',
    role: 'Backend Software Engineer',
    salary: 82000,
    joinDate: new Date('2024-03-15'),
  },
  {
    name: 'Emily Watson',
    email: 'emily.watson@technova.com',
    phone: '5552345678',
    department: 'Human Resources',
    role: 'HR Manager',
    salary: 75000,
    joinDate: new Date('2023-11-01'),
  },
  {
    name: 'Michael Scott',
    email: 'michael.scott@technova.com',
    phone: '5558765432',
    department: 'Sales',
    role: 'Regional Sales Director',
    salary: 90000,
    joinDate: new Date('2022-05-10'),
  },
  {
    name: 'Pam Beesly',
    email: 'pam.beesly@technova.com',
    phone: '5553456789',
    department: 'Human Resources',
    role: 'HR Coordinator',
    salary: 50000,
    joinDate: new Date(new Date().setDate(new Date().getDate() - 12)), // Joined 12 days ago (this month)
  },
  {
    name: 'David Lightman',
    email: 'david.lightman@technova.com',
    phone: '5557654321',
    department: 'Engineering',
    role: 'Security Consultant',
    salary: 110000,
    joinDate: new Date('2025-01-20'),
  },
  {
    name: 'Jane Foster',
    email: 'jane.foster@technova.com',
    phone: '5554567890',
    department: 'Product',
    role: 'Senior Product Manager',
    salary: 105000,
    joinDate: new Date('2024-08-12'),
  },
  {
    name: 'Tony Stark',
    email: 'tony.stark@technova.com',
    phone: '5556543210',
    department: 'Engineering',
    role: 'Chief Technology Officer',
    salary: 250000,
    joinDate: new Date('2021-02-15'),
  },
  {
    name: 'Natasha Romanoff',
    email: 'natasha.romanoff@technova.com',
    phone: '5555678901',
    department: 'Marketing',
    role: 'Brand Campaign Lead',
    salary: 80000,
    joinDate: new Date('2023-04-18'),
  },
  {
    name: 'Bruce Banner',
    email: 'bruce.banner@technova.com',
    phone: '5554321098',
    department: 'Product',
    role: 'Research Scientist',
    salary: 120000,
    joinDate: new Date(new Date().setDate(new Date().getDate() - 25)), // Joined 25 days ago (this month)
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_management');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employee records.');

    // Insert new seed records
    await Employee.insertMany(employees);
    console.log(`Successfully seeded ${employees.length} employee records!`);

    // Exit script
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
