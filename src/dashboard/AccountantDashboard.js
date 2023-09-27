/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './dashCSS/AllDashStyles.css';
import { LogoutButton, BackButton, useDashHooks } from './AllDashSetup.js'; 


function AccountantDashboard() {
  const navigate = useNavigate();

  const [cashHoldings, setCashHoldings] = useState([]);
  const [name, setName] = useState('');
  const userName = localStorage.getItem('userName');
  const [originalRole, setOriginalRole] = useState(localStorage.getItem('role'));


  useEffect(() => {
    // Fetch the name of the ACC from the backend
    api.get('/api/dashboard/acc/details', { withCredentials: true })
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching acc name:', error);
      });

    // Fetch cash holdings for all ACCs from the backend
    api.get('/api/dashboard/data', { withCredentials: true })
      .then(response => {
        setCashHoldings(response.data.cashHoldings);
      })
      .catch(error => {
        console.error('Error fetching cash holdings:', error);
      });
  }, []);

  const collectCash = (cashierID) => {
    // Collect the cash from the specified Cashier
    api.post('/api/dashboard/acc/update-cash-holding', { cashierID }, { withCredentials: true })
      .then(response => {
        // Update `cashHoldings` state with the updated data from the backend
        setCashHoldings(response.data.cashHoldings);
      })
      .catch(error => {
        console.error('Error collecting cash:', error);
      });
  };

  return (
    <div>
      <div className="d-flex justify-content-between p-2">
          <BackButton onBack={() => navigate(-1)} />
          <LogoutButton onLogout={useDashHooks} />
      </div>
      <h1 class="welcome-msg-dash">Welcome, {name}!</h1>
      <h2 class ="role-msg-dash">Role: {originalRole}</h2>
      <ul>
        {cashHoldings.map(holding => (
          <li key={holding.cashierID}>
            Cashier ID: {holding.cashierID}, Cash Holding: €{holding.amount}
            <button onClick={() => collectCash(holding.cashierID)}>Collect</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountantDashboard;
