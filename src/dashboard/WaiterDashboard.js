// src/dashboard/WaiterDashboard.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTables,
  selectAssignedTables,
  fetchTables,
  updateTableStatus
} from '../slices/dashSlice.js';

import DashSetup from './AllDashSetup.js'; 
import './dashCSS/WaiterDashboard.css';

import OrderInterface from './dashFunctions/OrderInterface.js';

const WaiterDashboard = () => {
    const dispatch = useDispatch();
    const tables = useSelector(selectTables);
    const assignedTables = useSelector(selectAssignedTables);

    const [view, setView] = useState('tableSelection');
    const [categories, setCategories] = useState([]);
    const [currentTable, setCurrentTable] = useState(null); 

    // Fetch categories from the backend and set them
    useEffect(() => {
      // Fetch categories logic here...
      // setCategories(fetchedCategories);
    }, []);

    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    //const handleShowAssignedClick = () => setShowAssignedTables(true);
    //const handleShowAllClick = () => setShowAssignedTables(false);

    const getTableClassName = (status) => {
        switch (status) {
          case 'FREE':
            return 'table-free';
          case 'BUSY':
            return 'table-busy';
          case 'RESERVED':
            return 'table-reserved-free';
          case 'RESERVED_BUSY':
            return 'table-reserved-busy';
          default:
            return '';
        }
    };

    const displayedTables = view === 'assigned' 
      ? assignedTables
      : tables;

    const handleViewChange = (newView) => {
      setView(newView);
    };
    
    const handleChangeStatus = (tableId, newStatus) => {
      dispatch(updateTableStatus({ tableId, status: newStatus }));
    };

    const handleEnterTable = (table) => {
      setCurrentTable(table);
      if (table.status.includes('RESERVED') || table.status === 'BUSY') {
        setView('ordering');
      } else if (table.status === 'FREE') {
        dispatch(updateTableStatus({ tableId: table._id, status: 'BUSY' }));
        setView('ordering');
      }
    };

    return (
      <div className="waiter-dashboard">
        <DashSetup />
        <div className="table-filter-buttons">
            <button className={view === 'assigned' ? 'selected' : ''} onClick={() => handleViewChange('assigned')}>
            Assigned Tables
            </button>
            <button className={view === 'all' ? 'selected' : ''} onClick={() => handleViewChange('all')}>
            All Tables
            </button>
        </div>

        <div className="tables-grid">
          {displayedTables && displayedTables.length > 0 && displayedTables
            .slice() // Ensure a copy is made if the array is readonly
            .sort((a, b) => a.tableNumber - b.tableNumber)
            .map((table) => (
              <div key={table.tableNumber} className={`table-box ${getTableClassName(table.status)}`}>
                <div className="table-number">T{table.tableNumber}</div>
                {table.status.includes('RESERVED') && <div className="reserved-indicator">R</div>}
                <button className="enter-button" onClick={() => handleEnterTable(table)}>ENTER</button>
              </div>
            ))}
        </div>

        {/* Conditional rendering of OrderInterface based on the current view */}
        {view === 'ordering' && <OrderInterface categories={categories} />}
      </div>
    );
};

export default WaiterDashboard;
