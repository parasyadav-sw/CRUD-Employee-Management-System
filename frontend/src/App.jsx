import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import Toast from './components/Toast';
import useNotification from './hooks/useNotification';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toasts, addToast, removeToast } = useNotification();

  // Render the appropriate page based on active tab state
  const renderActivePage = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeManagement triggerNotification={addToast} />;
      case 'dashboard':
      default:
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            triggerNotification={addToast}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Floating System-wide Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
