// src/dashboard/WaiterDashboard.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAssignedTables, selectTable } from '../slices/dashSlice.js';
import { selectUserName } from '../slices/authSlice.js';

// All Dashboard Setup + CSS (in 1 file)
import DashSetup from './AllDashSetup.js'; 

import OrderBox from '../components/Orders/OrderBox.js';
import TableBox from '../components/Tables/TableBox.js';

import WaiterNavbar from '../components/NavBar/WaiterNavBar.js';
import TablesSection from '../components/Tables/TablesSection.js';
import OrdersSummary from '../components/Orders/OrdersSummary.js';

import OrderManager from './dashFunctions/OrderManager.js';


const tableDataExample = {
    tableName: "T1",
    orders: [
        {
            orderId: 12,
            status: "HALF ready",
            items: [
                { name: "Heineken beer", price: 2, quantity: 3 },
                { name: "Chicken skewer", price: 2, quantity: 2 }
            ]
        },
        {
            orderId: 22,
            status: "READY!",
            items: [
                { name: "Pork skewer", price: 2, quantity: 3 },
                { name: "Coca-cola", price: 2, quantity: 2 }
            ]
        },
        {
            orderId: 31,
            status: "in-progress",
            items: [
                { name: "Pork skewer", price: 2, quantity: 10 },
                { name: "Coca-cola", price: 2, quantity: 10 },
                { name: "Heineken beer", price: 2, quantity: 6 }
            ]
        },
    ]
};


const WaiterDashboard = () => {
    const dispatch = useDispatch();

    const tables = useSelector(state => state.dashboard.tables || []);
    const selectedTable = useSelector((state) => state.dashboard.selectedTable);
    const waiterID = useSelector(selectUserName);

    const [selectedTableData, setSelectedTableData] = useState(null);
    const [ordersForSelectedTable, setOrdersForSelectedTable] = useState([]);

    const handleUpdateStatus = async (tableId, newStatus) => {
        try {
            const response = await fetch(`/api/tables/${tableId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update table status.');
            }
    
            // Update the tables in the local state or re-fetch them
            dispatch(fetchAssignedTables(waiterID));
    
        } catch (error) {
            console.error('Error updating table status:', error);
            // You might also want to show a user-friendly error message using a toast or modal.
        }
    };
    


    console.log('(Waiter Dash) waiterID is ', waiterID);

    useEffect(() => {
        if (waiterID) {
            dispatch(fetchAssignedTables(waiterID));
        }
    }, [dispatch, waiterID]);

    console.log('First table from tables array:', tables[0]);

    const handleTableClick = async (table) => {
        console.log('Selected table:', table);

        // Fetch orders for the selected table.
        // This assumes there's an endpoint `/api/ordersByTable` that accepts a table number.
        const response = await fetch(`/api/ordersByTable?tableNumber=${table.number}`);
        const data = await response.json();

        setOrdersForSelectedTable(data.orders);
        setSelectedTableData(table);
    };

    return (
        <div className="waiter-dashboard">
                <DashSetup />
                <hr />
                <h2>Tables</h2>
                <div className="tables-grid">
                    {tables.map(table => (
                        <TableBox key={table._id} table={table} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </div>

                {selectedTableData && <OrderBox tableData={selectedTableData} />}

            <hr />
                {/*selectedTable && <OrderManager table={selectedTable} />
                <TablesSection />
                <OrdersSummary />*/}
        </div>
    );
};

export default WaiterDashboard;
