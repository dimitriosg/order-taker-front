/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';

// for the MENU
import AddMenuItem from '../components/Menu/AddMenuItems.js';
import RemoveMenuItem from '../components/Menu/RemoveMenuItem.js';
import GetAllMenuItems from '../components/Menu/GetAllMenuItems.js';

// for the USERS
import AddUser from '../components/Users/AddUser.js';
import RemoveUser from '../components/Users/RemoveUser.js';
import ListAllUsers from '../components/Users/ListAllUsers.js';

// for the TABLES
import AddTable from '../components/Tables/AddTable.js';
import RemoveTable from '../components/Tables/RemoveTable.js';
import GetAllTables from '../components/Tables/GetAllTables.js';
import ReserveTable from '../components/Tables/ReserveTable.js';
import ReservedTables from '../components/Tables/ReservedTables.js';
//import NewComponent3 from '../components/Tables/NewComponent3.js';

// for the ORDERS


// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 

import './dashCSS/AdminDashboard.css';


////////////////////////////////
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('menu');  // This stays the same since it's local state

    const [showModal, setShowModal] = useState(false);
    const [userToModify, setUserToModify] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    return (
        <div className="admin-dashboard">
            <DashSetup />
            <hr />

            <div className="tabs">
                <button className={activeTab === 'users' ? 'selected' : ''} onClick={() => setActiveTab('users')}>Users</button>
                <button className={activeTab === 'menu' ? 'selected' : ''} onClick={() => setActiveTab('menu')}>Menu</button>
                <button className={activeTab === 'orders' ? 'selected' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
                <button className={activeTab === 'tables' ? 'selected' : ''} onClick={() => setActiveTab('tables')}>Tables</button>
            </div>
            <div className="tab-content">
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'menu' && <MenuTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'tables' && <TablesTab />}
            </div>
        </div>
    );
};

const UsersTab = () => {
    const [mode, setMode] = useState('list-all');
    
    return (
        <div className="users-management">
            <div className="user-tabs">
                <button className={mode === 'add' ? 'selected' : ''} onClick={() => setMode('add')}>Add User</button>
                <button className={mode === 'remove' ? 'selected' : ''} onClick={() => setMode('remove')}>Remove User</button>
                <button className={mode === 'list-all' ? 'selected' : ''} onClick={() => setMode('list-all')}>List All Users</button>
            </div>
            {mode === 'add' && <AddUser />}
            {mode === 'remove' && <RemoveUser />}
            {mode === 'list-all' && <ListAllUsers />}
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

const TablesTab = () => {
    const [mode, setMode] = useState('get-all');
    
    return (
        <div className="tables-management">
            <div className="table-tabs first-row">
                <button className={mode === 'add' ? 'selected' : ''} onClick={() => setMode('add')}>Add Table</button>
                <button className={mode === 'remove' ? 'selected' : ''} onClick={() => setMode('remove')}>Remove Table</button>
                <button className={mode === 'get-all' ? 'selected' : ''} onClick={() => setMode('get-all')}>List All Tables</button>
            </div>
            <div className="table-tabs second-row">
                <button className={mode === 'reservetable' ? 'selected' : ''} onClick={() => setMode('reservetable')}>Reserve</button>
                <button className={mode === 'reservedtables' ? 'selected' : ''} onClick={() => setMode('reservedtables')}>Reserved Tables</button>
                <button className={mode === 'reservetable3' ? 'selected' : ''} onClick={() => setMode('reservetable3')}>Reserve 3</button>
            </div>
            {mode === 'add' && <AddTable />}
            {mode === 'remove' && <RemoveTable />}
            {mode === 'get-all' && <GetAllTables />}
            {mode === 'reservetable' && <ReserveTable />}
            {mode === 'reservedtables' && <ReservedTables />}
            {mode === 'reservetable3' && <ReserveTable />}
        </div>
    );
};



const AccountStatusToggle = ({ user, onToggleClick, isActive }) => {
    const baseStyles = {
        button: {
            backgroundColor: user.accountStatus === "Active" ? "green" : (user.accountStatus === "Locked" ? "red" : "gray"),
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            border: 'none',
            marginBottom: '3px'
        },
        statusLabel: {
            fontSize: '10px',
            color: '#777'
        }
    };

    const activeStyles = {
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',  // Inset shadow for the "pressed" effect
        backgroundColor: "#555555",  // Darker background color for the active button
    };

    // Merge the two styles if isActive is true
    const styles = isActive ? {...baseStyles, ...activeStyles} : baseStyles;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={styles.button} onClick={onToggleClick}>
                {user.accountStatus}
            </button>
        </div>
    );
};

export default AdminDashboard;
