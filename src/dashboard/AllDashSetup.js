// AllDashSetup.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from './slices/authSlice.js';
import './dashCSS/AllDashStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export const DashboardHeader = ({ userName, originalRole }) => (
    <div className="dashboard-header">
        <h1 className="welcome-msg-dash">Welcome, {userName}!</h1>
        <h2 className="role-msg-dash">Role: {originalRole}</h2>
    </div>
);

export const useDashHooks = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return {
        handleLogout
    };
};


export const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = () => {
      dispatch(logout());  // This will clear the auth state and remove token, role, and userName from localStorage
      navigate('/login');  // Redirect to login page after logging out
    };
  
    return (
      <button 
        className="btn btn-danger logout-button" 
        id="logout-button" onClick={handleLogout} >
        Logout
      </button>
    );
};

export const BackButton = ({ onBack }) => (
    <button className="btn btn-secondary back-button" 
        id="back-button" onClick={onBack}>
        Back
    </button>
);


// Export any other common components or utilities here...
