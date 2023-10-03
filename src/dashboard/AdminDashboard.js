/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js
import React, { useState } from 'react';

// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 



////////////////////////////////
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');  // This stays the same since it's local state


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
