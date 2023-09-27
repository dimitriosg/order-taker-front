/* eslint-disable no-unused-vars */
// src/dashboard/WaiterDashboard.js

import React, { useState, useEffect } from 'react';
import TableBox from './dashFunctions/TableBox.js';
import OrderManager from './dashFunctions/OrderManager.js';
import './css/WaiterDashboard.css';  // Import the CSS
import LogoutButton from '../components/LogoutButton';
import '../styles/DashboardStyles.css';  // Import the styles

import WaiterNavbar from './components/Navbar/WaiterNavbar';
import TablesSection from './components/Tables/TablesSection';
import OrdersSummary from './components/Orders/OrdersSummary';



const WaiterDashboard = () => {
    //const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const userName = localStorage.getItem('userName');

    const tables = [1, 2, 3, 4, 5, 6];  // Example table numbers
    // as an example for now

    useEffect(() => {
        // Fetch the tables assigned to the waiter from the backend
        fetchAssignedTables();
    }, []);

    const fetchAssignedTables = async () => {
        // Assume there's an API endpoint to get the tables assigned to the logged-in waiter
        try {
            const response = await fetch('/api/tables');
            const data = await response.json();
            //setTables(data.tables);
        } catch (error) {
            console.error('Error fetching assigned tables:', error);
        }
    };

    return (
        <div className="waiter-dashboard">
            <WaiterNavbar />
            <LogoutButton />
            <h1>Welcome, {localStorage.getItem('userName')}!</h1>
            <hr />
            <h2>Tables</h2>
            <div className="tables-grid">
                {tables.map((table, index) => (
                    <TableBox
                        key={index}
                        table={table}
                        onSelect={() => setSelectedTable(table)}
                    />
                ))}
            </div>
            <hr />
            {selectedTable && <OrderManager table={selectedTable} />}
            <TablesSection />
            <OrdersSummary />
        </div>
    );
};

export default WaiterDashboard;
