// AllDashSetup.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        navigate('/');
    };

    return {
        handleLogout
    };
};

export const LogoutButton = ({ onLogout }) => (
    <button className="btn btn-danger logout-button" 
        id="logout-button" onClick={onLogout}>
        Logout
    </button>
);

export const BackButton = ({ onBack }) => (
    <button className="btn btn-secondary back-button" 
        id="back-button" onClick={onBack}>
        Back
    </button>
);


// Export any other common components or utilities here...
