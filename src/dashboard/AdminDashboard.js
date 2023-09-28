/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// All Dashboard Setup + CSS (in 1 file)
import './AllDashSetup.js'; 
import { DashboardHeader, LogoutButton, BackButton, handleLogout } from './AllDashSetup.js'; 

import RoleSwitcher from '../components/RoleSwitcher';


const AdminDashboard = () => {
    const navigate = useNavigate();
    console.log(localStorage);  // Debugging line
    const [userName, setUserName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [originalRole, setOriginalRole] = useState('');
    const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        setUserName(localStorage.getItem('userName') || 'User');
        setOriginalRole(localStorage.getItem('role') || null );
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            <div className="d-flex justify-content-between p-2">
                <BackButton onBack={() => navigate('/login')} />
                <LogoutButton onLogout={handleLogout} />
            </div>
            
            <DashboardHeader 
                userName={userName} 
                originalRole={originalRole} 
            />

            <hr />
            <div className="tabs">
                <button onClick={() => setActiveTab('users')}>Users</button>
                <button onClick={() => setActiveTab('menu')}>Menu</button>
                <button onClick={() => setActiveTab('orders')}>Orders</button>
            </div>
            <div className="tab-content">
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'menu' && <MenuTab />}
                {activeTab === 'orders' && <OrdersTab />}
            </div>

            <hr />
            <RoleSwitcher />
        </div>
    );
};

const UsersTab = () => {
    return (
        <div className="users-tab">
            {/* Content for managing users */}
        </div>
    );
};

const MenuTab = () => {
    return (
        <div className="menu-tab">
            {/* Content for managing menu items */}
        </div>
    );
};

const OrdersTab = () => {
    return (
        <div className="orders-tab">
            {/* Content for managing orders */}
        </div>
    );
};

export default AdminDashboard;
