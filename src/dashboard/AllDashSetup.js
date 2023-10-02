/* eslint-disable no-unused-vars */
// AllDashSetup.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    selectUserRole, 
    selectUserName
} from '../slices/authSlice.js'; // original from db

import { 
    selectOriginalRole, 
    selectHasSwitchedRole, 
} from '../slices/roleSwitchSlice'; // for role switch

import RoleSwitcher from '../components/RoleSwitcher.js';

import { logout } from '../slices/authSlice.js';

import './dashCSS/AllDashStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export const DashboardHeader = () => {
    const userName = useSelector(selectUserName);
    const originalRole = useSelector(selectUserRole);
    const hasSwitchedRole = useSelector(selectHasSwitchedRole);
    const selectedRole = localStorage.getItem('selectedRole');


    return (
        <div className="dashboard-header">
            <h1 className="welcome-msg-dash">Welcome, {userName}!</h1>
            <h4 className="original-role-msg-dash">Original Role: {originalRole}</h4>
            {hasSwitchedRole && selectedRole && selectedRole !== originalRole && (
                <h6 className="selected-role-msg-dash">Selected Role: {selectedRole}</h6>
            )}
        </div>
    );
};


export const useDashHooks = () => { // for handleLogout
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

const AllDashSetup = () => {
    const navigate = useNavigate();
    const { handleLogout } = useDashHooks();

    const userName = useSelector(selectUserName) || 'User';
    const originalRole = useSelector(selectOriginalRole);
    const hasSwitchedRole = useSelector(selectHasSwitchedRole);
    const selectedRole = localStorage.getItem('selectedRole');

    console.log('Original Role:', originalRole);
    console.log('Selected Role:', selectedRole);
    console.log('Has Switched Role:', hasSwitchedRole);

    return (
        <div>
            <div className="d-flex justify-content-between p-2">
                <BackButton onBack={() => navigate('/login')} />
                <LogoutButton onLogout={handleLogout} />
            </div>
            <DashboardHeader 
                userName={userName} 
                originalRole={originalRole} 
                selectedRole={selectedRole} 
                hasSwitchedRole={hasSwitchedRole}
            />
            <hr />
            <RoleSwitcher />
        </div>
    );
};

export default AllDashSetup;