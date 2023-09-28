/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import OrdersSection from '../pages/OrdersSection.js';
import RoleSwitcher from '../components/RoleSwitcher';
import { DashboardHeader, LogoutButton, BackButton, useDashHooks } from './AllDashSetup.js'; 



const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [originalRole, setOriginalRole] = useState(localStorage.getItem('role'));
  const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
  const userName = localStorage.getItem('userName');

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleApplyRole = () => {
    if (selectedRole) {
      RoleSwitcher(selectedRole, navigate);
      setHasSwitchedRole(true);
    }
  };

  const handleRevertRole = () => {
    if (hasSwitchedRole) {
      RoleSwitcher(originalRole, navigate);
      setHasSwitchedRole(false);
    }
  };

  return (
    <div className="developer-dashboard">
      <div className="d-flex justify-content-between p-2">
          <BackButton onBack={() => navigate('/login')} />
          <LogoutButton onLogout={useDashHooks} />
      </div>

      <DashboardHeader 
          userName={userName} 
          originalRole={originalRole} 
      />

      <hr />
      <RoleSwitcher />
      <hr />
      
    </div>
  );
};

export default DeveloperDashboard;
