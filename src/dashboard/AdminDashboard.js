/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RoleSwitcher from '../components/RoleSwitcher.js';

// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 



////////////////////////////////
const AdminDashboard = () => {
    console.log(localStorage);  // Debugging line
    const [userName, setUserName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [originalRole] = useState(localStorage.getItem('role'));    const [hasSwitchedRole, setHasSwitchedRole] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        setUserName(localStorage.getItem('userName') || 'User');
    }, []);

    return (
        <div className="admin-dashboard">
            <DashSetup />
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
