/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader, LogoutButton, BackButton, useDashHooks } from './AllDashSetup.js'; 
import './dashCSS/AllDashStyles.css';



function CashierDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');
  const [originalRole] = useState(localStorage.getItem('role'));
  const [cashHolding, setCashHolding] = useState(null);
  const [name, setName] = useState('');
  

  useEffect(() => {
    // Fetch the current cash holding and the name of the cashier from the backend
    // Update `cashHolding` and `name` state
    // Assume we have a function fetchCashierDetails() that returns the necessary data
    // fetchCashierDetails().then(data => {
    //   setCashHolding(data.cashHolding);
    //   setName(data.name);
    // });
  }, []);

  const updateCashHolding = (newAmount) => {
    // Update the cash holding in the backend
    // Update `cashHolding` state
    // Assume we have a function updateCashHoldingInBackend() that updates the backend
    // updateCashHoldingInBackend(newAmount).then(updatedCashHolding => {
    //   setCashHolding(updatedCashHolding);
    // });
  };

  const notifyAccountant = () => {
    // Notify the Accountant to collect the cash
    // Reset `cashHolding` amount to zero
    // Assume we have a function notifyAccountantInBackend() that notifies the accountant and resets the cash holding
    // notifyAccountantInBackend().then(() => {
    //   setCashHolding({ amount: 0 });
    // });
  };

  return (
    <div>
      <div className="d-flex justify-content-between p-2">
          <BackButton onBack={() => navigate('/login')} />
          <LogoutButton onLogout={useDashHooks} />
      </div>
      <DashboardHeader 
          userName={userName} 
          originalRole={originalRole} 
      />
      <p>Current Cash Holding: €{cashHolding?.amount || 0}</p>
      <button onClick={() => updateCashHolding(cashHolding.amount + 100)}>Add €100</button>
      <button onClick={notifyAccountant}>Notify Accountant</button>
    </div>
  );
}

export default CashierDashboard;
