/* eslint-disable no-unused-vars */
// src/dashboard/DeveloperDashboard.js
import React, { useEffect, useState } from 'react';

// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 

import OrdersSection from '../pages/OrdersSection.js';

////////////////////////////////
const DeveloperDashboard = () => {

  console.log(localStorage);  // Debugging line
  const [userName, setUserName] = useState('');
  const [originalRole] = useState(localStorage.getItem('role'));
  const [selectedRole, setSelectedRole] = useState('');
  const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'User');
}, []);

  return (
      <div className="developer-dashboard">
        <DashSetup />
      
    </div>
  );
};

export default DeveloperDashboard;
