# CRUD Employee Management System

## Technical Documentation & Submission Guide (Week 2)

This documentation provides a comprehensive, production-ready guide to the architecture, features, and source code of the **CRUD Employee Management System**. It is designed to fulfill your Week 2 submission requirements and prepare you to excel in your live code walkthrough.

---

## 📂 Project Architecture & File Hierarchy

The application follows a decoupled full-stack architecture, separating the backend REST API server and the React-based client web app.

```text
CRUD Employee Management System/
├── start-app.bat                       # Startup script running backend & frontend concurrently
├── server/                              # Node.js & Express REST API Server
│   ├── config/db.js                    # Mongoose database connector with fast fallback
│   ├── config/jsonDb.js                # Custom JSON-based mock database fallback engine
│   ├── controllers/employeeController.js# Database controllers & analytics aggregation
│   ├── middleware/validationMiddleware.js# Server-side schema payload validation
│   ├── middleware/errorMiddleware.js     # Centralized Express error handler & 404 router
│   ├── models/employeeModel.js          # Mongoose Schema definition for Employee records
│   ├── routes/employeeRoutes.js        # Express API router mappings
│   ├── scripts/seed.js                  # Sample dataset generator script
│   ├── package.json                    # Server-side package manager file
│   └── server.js                       # Express application bootstrap entrypoint
│
└── frontend/                            # React Client Web App (Vite)
    ├── vite.config.js                  # Frontend configuration settings
    ├── package.json                    # Frontend package manager file
    └── src/
        ├── App.jsx                     # Root navigation shell
        ├── main.jsx                    # React bootstrap entrypoint
        ├── index.css                   # Custom global CSS styles & variables
        ├── components/                 # Reusable UI elements (ConfirmModal, Toast, Spinner, Sidebar)
        ├── hooks/useNotification.js    # React hook for toast feedback notifications
        ├── pages/Dashboard.jsx         # Analytics view showing company metrics
        ├── pages/EmployeeManagement.jsx # Directory view showing searchable table & toolbar
        ├── services/api.js             # Axios client instance & REST API call mappings
        └── utils/formatters.js         # Currency and date formatter helpers
```

---

## ⚙️ Architecture & Implementation Highlights

### 1. Resilient Dual-Database Architecture

- **Mechanism**: The backend implements a robust fallback mechanism inside `server/config/db.js`.
- **Logic**:
  - The app tries to connect to MongoDB with a short timeout of `2500ms`.
  - If MongoDB is not running or fails to connect, the server catches the error, warns the console, and sets `global.useJsonDb = true`.
  - All controller operations inspect `global.useJsonDb`. If active, they read and write local JSON file records in `server/data/employees.json` using the custom `jsonDb.js` module.
  - _Why this is impressive_: The frontend remains completely unaffected. The application works out-of-the-box even if the evaluator does not have MongoDB installed or running.

### 2. HR Dashboard Analytics

- **Mechanism**: The statistics endpoint `/api/employees/dashboard/stats` calculates company metrics dynamically.
- **Logic**:
  - **Total Employees**: Aggregated via `countDocuments()`.
  - **Average Salary**: Aggregated in MongoDB using the Aggregation Pipeline:
    ```javascript
    await Employee.aggregate([
      { $group: { _id: null, avgSalary: { $avg: "$salary" } } },
    ]);
    ```
  - **New Hires**: Calculates boundary date-times for the start and end of the current calendar month, then filters records where `joinDate` falls within that range.
- **Code Reference**: `getDashboardStats()` in `employeeController.js`.

### 3. Server-Side Filtering, Sorting & Pagination

- **Mechanism**: Query parameters (`search`, `sortBy`, `order`, `page`, `limit`) are mapped to Mongoose selectors inside `getEmployees`.
- **Logic**:
  - _Search_: Implements a case-insensitive regular expression match mapping against `name`, `email`, `department`, or `role`.
  - _Sort_: Maps request fields to sorting directives (`1` for ascending, `-1` for descending).
  - _Pagination_: Converts `page` and `limit` to offsets using `.skip((page - 1) * limit).limit(limit)`.
- **Code Reference**: `getEmployees` in `employeeController.js`.

### 4. Client-Side State Management & Form Handling

- **React State**: Form fields are managed using standard hooks (`useState`). Modals load dynamic contexts depending on whether the action is `Add` or `Edit` (pre-populating existing states).
- **Toast Notification System**: Handled via custom `useNotification.js` hook. Displays slide-in overlays for Success, Info, or Error events that fade out automatically after 4 seconds.
- **Code Reference**: `EmployeeFormModal.jsx` and `Toast.jsx` in the frontend source.

---

## 📸 Screenshots Blueprint

Capture the following screenshots to fulfill the submission requirements:

1.  **`01_hr_dashboard.png`**: The HR Dashboard page showing the four metric cards populated with seeded numbers, system notices, and quick links.
    ![HR Dashboard](screenshots/01_hr_dashboard.png)

2.  **`02_employee_directory.png`**: The Employee Directory page showing the responsive table, sorting indicators on column headers, and pagination controls.

3.  **`03_search_filter_active.png`**: The table after entering a search term (showing only filtered records).
    ![Search Filter](screenshots/03_search_filter_active.png)

4.  **`04_add_employee_modal.png`**: The "Add Employee" modal overlay displaying input fields.
    ![Add Employee](screenshots/04_add_employee_modal.png)

5.  **`05_client_validation_error.png`**: The Add Form with active validation errors showing on empty/incorrect inputs.
    ![Validation](screenshots/05_client_validation_error.png)

6.  **`06_edit_employee_prefilled.png`**: The "Edit Employee" modal displaying prefilled data for a chosen employee.
    ![Edit Employee](screenshots/06_edit_employee_prefilled.png)

7.  **`07_delete_confirmation.png`**: The soft confirmation delete modal indicating the employee name before purging.
    ![Delete Confirmation](screenshots/07_delete_confirmation.png)

8.  **`08_success_toast_notification.png`**: The floating success toast notification showing after a save/delete action.
    ![Success Toast](screenshots/08_success_toast_notification.png)

---

## 📹 Demo Video Recording Script

### Technical Setup:

- **Resolution**: 1080p, 16:9 aspect ratio.
- **Duration**: ~90 to 120 seconds.
- **Microphone**: High-quality audio.

### Narration Storyboard:

| Timestamp       | Visual Action                                                                                                                | Narration Script                                                                                                                                                                                                                                                                               |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0:00 - 0:15** | Start on the HR Dashboard page. Highlight the metric cards.                                                                  | _"Welcome to the CRUD Employee Management System. Our dashboard automatically fetches and displays key metrics from the database, including total employee counts, active departments, average payroll, and new hires this calendar month."_                                                   |
| **0:15 - 0:30** | Click on "Employees" in the sidebar to open the directory table.                                                             | _"Navigating to the directory, we see a clean data table displaying employee profiles. The list supports ascending and descending sorting on columns like Name, Department, and Salary, all processed dynamically."_                                                                           |
| **0:30 - 0:45** | Type a name into the search bar. Show the table filtering in real-time.                                                      | _"The search bar implements real-time query filtering. As I type a role, name, or department, the table updates instantly. We can also adjust the display size using the pagination dropdown."_                                                                                                |
| **0:45 - 1:15** | Click "Add Employee". Attempt to submit empty to show errors. Fill it out correctly, click save, and show the success toast. | _"Let's add a new employee. If I try to submit the form blank, client-side validations block the submission. Filling in valid details, including a matching email format and a 10-digit phone number, adds the record to the system and shows a success toast."_                               |
| **1:15 - 1:35** | Search for the newly added employee. Click the "Edit" button. Modify their salary and role, then save.                       | _"I can search for our new hire, open the Edit modal—which pre-populates all inputs—modify their role and salary, and submit. The dashboard average salary recalculates immediately."_                                                                                                         |
| **1:35 - 1:50** | Click "Delete" on a row. Confirm deletion in the soft overlay.                                                               | _"Finally, deleting a record prompts a soft confirmation check before removing the employee from the database. The system is designed with a MongoDB connection timeout that falls back to a local JSON database if MongoDB is offline, ensuring 100% server uptime. Thank you for watching!"_ |
