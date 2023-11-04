// frontend\src\dashboard\dashFunctions\TableInterface.js

import React from 'react';
import { useSelector } from 'react-redux';
import { selectOrder } from '../../slices/dashSlice.js';

import '../dashCSS/WaiterDashboard.css';


const TableInterface = ({ 
    table, 
    onBackButtonClick, 
    onOccupyTable, 
    onPlaceOrder }) => {

    const order = useSelector(selectOrder); // Get the order from Redux store
    const orderCount = order ? Object.keys(order).length : 0;

    

    return (
        <div className="table-interface">
            <button onClick={onBackButtonClick}>Back</button>
            <div className="table-details">
                <h2>
                    Table #{table.tableNumber} <br />
                    Status:{" "}
                    <span className={`status-${table.status.toLowerCase()}`}>
                        {table.status}
                    </span>
                </h2>
                <div>Total Orders: {orderCount}</div>
            </div>

            <div className="table-items">
                <p> Items:</p>
            </div>
            
            {table.status === 'free' && <button onClick={onOccupyTable}>Occupy</button>}
            {table.status === 'busy' && <button onClick={onPlaceOrder}>Place Order</button>}
        </div>
    );
};

export default TableInterface;
