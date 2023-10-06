/* eslint-disable no-unused-vars */
// src/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import AddMenuItem from '../components/Menu/AddMenuItems.js';
import RemoveMenuItem from '../components/Menu/RemoveMenuItem.js';
import GetAllMenuItems from '../components/Menu/GetAllMenuItems.js';

// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 

import './dashCSS/AdminDashboard.css';
import { ConfirmationModal } from '../components/Modals.js';
import { displayMessage } from '../utils/usefulFunc';

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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [clickedButton, setClickedButton] = useState(null);

    // State to track which user's status is currently selected/active
    const [activeUserId, setActiveUserId] = useState(null);


    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users/list');
            
            if (!response.data || !response.data.users) {
                throw new Error('Invalid response from server');
            }

            const sortedUsers = response.data.users.sort((a, b) => a.role.localeCompare(b.role));
            setUsers(sortedUsers);
        } catch (err) {
            setError(err.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

    const groupedUsers = users.reduce((acc, user) => {
        if (!acc[user.role]) {
            acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
    }, {});

    const closeAllModals = () => {
        setIsModalVisible(false); 
        setIsSuccessModalVisible(false);
    };
    

    const handleStatusChange = async () => {
        try {
            const response = await api.put(`/api/users/updateStatus/${selectedUser._id}`, { status: selectedStatus });
            if (response.status === 200) {
                displayMessage("Successfully changed!", "success", closeAllModals);
                setIsSuccessModalVisible(true);
                fetchUsers(); // Refresh users to get the updated status
            } else {
                throw new Error(response.data.message || 'Error updating status');
            }
        } catch (error) {
            window.displayError(error.message);
        }
    };

    return (
        <div className="users-tab">
            <h2>USERS by Role</h2>
            {Object.keys(groupedUsers).map(role => (
                <div key={role} className="role-group">
                    <h3>{role.charAt(0).toUpperCase() + role.slice(1)}:</h3>
                    {groupedUsers[role].map(user => (
                        <div 
                            key={user._id} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '5px', 
                                paddingLeft: '10px' 
                            }}
                        >
                            <AccountStatusToggle 
                                user={user} 
                                onToggleClick={() => {
                                    setSelectedUser(user);
                                    setIsModalVisible(true);
                                    setActiveUserId(user._id);
                                }}
                                isActive={activeUserId === user._id}
                            />
                            <span style={{ marginLeft: '1px' }}>{user.name} - {user.email}</span>
                        </div>
                    ))}
                </div>
            ))}
    
            {isModalVisible && selectedUser && (
                <ConfirmationModal 
                    show={isModalVisible}
                    successMessage={isSuccessModalVisible}
                    selectedUser={selectedUser}
                    onClose={closeAllModals}
                    message={[
                        "You are about to change the status for:",
                        `${selectedUser ? selectedUser.name : ""}, role of ${selectedUser ? selectedUser.role : ""}`,
                        "Please choose an option:"
                    ]}
                    onConfirm={() => handleStatusChange()}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setSelectedStatus(null);
                    }}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
            )}
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
