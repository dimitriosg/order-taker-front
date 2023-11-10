// src/dashboard/dashFunctions/WaiterInterface.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTables,
  selectAssignedTables,
  fetchTables,
  updateTableStatus,
  selectOrder
} from '../../slices/dashSlice.js';

import DashSetup from '../AllDashSetup.js'; 
import '../dashCSS/WaiterDashboard.css';

import OrderInterface from './OrderInterface.js';
import TableInterface from './TableInterface.js';

const WaiterInterface = () => {
    const dispatch = useDispatch();
    const tables = useSelector(selectTables);
    const assignedTables = useSelector(selectAssignedTables);
    const orderState = useSelector(selectOrder);
  
    const [view, setView] = useState('tableSelection');
    const [currentTable, setCurrentTable] = useState(null); 
    const [showTableInterface, setShowTableInterface] = useState(false);

    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    const getTableClassName = (status) => {
        switch (status.toLowerCase()) {
          case 'free':
            return 'table-free';
          case 'busy':
            return 'table-busy';
          case 'reserved-free':
            return 'table-reserved-free';
          case 'reserved-busy':
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
  
    const handleEnterTable = (table) => {
      setCurrentTable(table);
      setShowTableInterface(true);
    };

    const handleOccupyTable = () => {
      dispatch(updateTableStatus({ tableId: currentTable._id, status: 'busy' }));
      setShowTableInterface(true); // Show TableInterface after changing status
    };


    const handleBackButtonClick = () => {
        setShowTableInterface(false);
        setCurrentTable(null);
    };

    const handlePlaceOrder = () => {
        // Logic to handle order placement
    };

    return (
        <div className="waiter-dashboard">
            {showTableInterface && currentTable ? (
                <TableInterface 
                    table={currentTable} 
                    onBackButtonClick={handleBackButtonClick}
                    onOccupyTable={() => handleOccupyTable(currentTable)}
                    onPlaceOrder={handlePlaceOrder}
                />
            ) : (
                <>
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
                            .slice()
                            .sort((a, b) => a.tableNumber - b.tableNumber)
                            .map((table) => (
                                <div key={table._id} className={`table-box ${getTableClassName(table.status)}`}>
                                    <div className="table-number">T{table.tableNumber}</div>
                                    {table.status.includes('reserved') && <div className="reserved-indicator">R</div>}
                                    <button className="enter-button" onClick={() => handleEnterTable(table)}>ENTER</button>
                                </div>
                            ))}
                    </div>
                    
                    {/* Conditional rendering of OrderInterface */}
                    {orderState && currentTable && (
                        <OrderInterface table={currentTable} />
                    )}
                </>
            )}
        </div>

        <div className="tables-grid">
          {displayedTables && displayedTables.length > 0 && displayedTables
            .slice() // Ensure a copy is made if the array is readonly
            .sort((a, b) => a.tableNumber - b.tableNumber)
            .map((table) => (
              <div key={table._id} className={`table-box ${getTableClassName(table.status)}`}>
                <div className="table-number">T{table.tableNumber}</div>
                {table.status.includes('reserved') && <div className="reserved-indicator">R</div>}
                <button className="enter-button" onClick={() => handleEnterTable(table)}>ENTER</button>
              </div>
            ))}
        </div>

        {currentTable && <OrderInterface table={currentTable} />}
        </>
      )}
    </div>
    );
};

export default WaiterInterface;
