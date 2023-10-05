/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMenuItem from '../components/Menu/AddMenuItems.js';
import RemoveMenuItem from '../components/Menu/RemoveMenuItem.js';
import GetAllMenuItems from '../components/Menu/GetAllMenuItems.js';

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
                <button className={activeTab === 'users' ? 'selected' : ''} onClick={() => setActiveTab('users')}>Users</button>
                <button className={activeTab === 'menu' ? 'selected' : ''} onClick={() => setActiveTab('menu')}>Menu</button>
                <button className={activeTab === 'orders' ? 'selected' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
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
    const [mode, setMode] = useState('add');
    
    return (
        <div className="menu-management">
            <div className="menu-tabs">
                <button className={mode === 'add' ? 'selected' : ''} onClick={() => setMode('add')}>Add Item</button>
                <button className={mode === 'remove' ? 'selected' : ''} onClick={() => setMode('remove')}>Remove Item</button>
                <button className={mode === 'get-all' ? 'selected' : ''} onClick={() => setMode('get-all')}>Show All Items</button>
            </div>
            {mode === 'add' && <AddMenuItem />}
            {mode === 'remove' && <RemoveMenuItem />}
            {mode === 'get-all' && <GetAllMenuItems />}
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
