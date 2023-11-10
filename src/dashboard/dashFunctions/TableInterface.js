// frontend\src\dashboard\dashFunctions\TableInterface.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrder, updateTableStatus, fetchTableById  } from '../../slices/dashSlice.js';

import { ConfirmationModalItem, ReservationDetailsModal } from '../../components/Modals.js';

//import '../dashCSS/WaiterDashboard.css';
import './dashFuncStyles/TableInterface.css';


const TableInterface = ({ 
    table: initialTable, 
    onBackButtonClick, 
    onPlaceOrder }) => {

    const dispatch = useDispatch();
    const [table, setTable] = useState(initialTable);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showReservationDetails, setShowReservationDetails] = useState(false);

    const order = useSelector(selectOrder); // Get the order from Redux store
    const orderCount = order ? Object.keys(order).length : 0;

    console.log("Table status:", table.status); // Add this line to debug


    const handleStatusChange = async (newStatus) => {
        // If the table is reserved, change status to 'reserved-busy' instead of just 'busy'
        const updatedStatus = table.status.includes('reserved') && newStatus === 'busy' 
                                ? 'reserved-busy' 
                                : newStatus;

        await dispatch(updateTableStatus({ tableId: table._id, status: updatedStatus }));
        // Update the local state to reflect the new status
        setTable({ ...table, status: updatedStatus });
    };
    
    
    const handleFreeTable = () => {
        setShowConfirmationModal(true);
    };

    const confirmFreeTable = () => {
        dispatch(updateTableStatus({ tableId: table._id, status: 'free' }));
        setTable({ ...table, status: 'free' });
        setShowConfirmationModal(false);
    };

    const renderStatus = () => {
        if (table.status === 'reserved-free') {
            return <span className="status-reserved-free">reserved (free)</span>;
        } else if (table.status === 'reserved-busy') {
            return <span className="status-reserved-busy">reserved (busy)</span>;
        } else {
            return <span className={`status-${table.status.toLowerCase()}`}>{table.status}</span>;
        }
    };


    return (
        <div className="table-interface">
            <div className='back-and-change-status'
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '30px' }}>

                <button onClick={onBackButtonClick}>Back</button>

                {/* Show Occupy button for reserved-free tables */}
                {(table.status === 'free' || table.status === 'reserved-free') && (
                    <button 
                        id="occupy-table" 
                        onClick={() => handleStatusChange('busy')}
                        >Occupy
                    </button>
                )}

                {/* Show Place Order and Free Table buttons for busy and reserved-busy tables */}
                {(table.status === 'busy' || table.status === 'reserved-busy') && (
                    <>
                        <button 
                            id="place-order" 
                            onClick={onPlaceOrder}>Place Order
                        </button>
                        <button 
                            id="free-table" 
                            onClick={handleFreeTable}>Free Table
                        </button>
                    </>
                )}

                {/* Fallback UI for debugging */}
                {!(table.status === 'free' || table.status === 'reserved-free' || table.status === 'busy' || table.status === 'reserved-busy') && (
                    <p>This table is: {table.status}</p>
                )}
            </div>

            <div className="table-details">
                <h2>
                    Table #{table.tableNumber} <br />
                    Status: {renderStatus()}
                </h2>
            </div>

            {(table.status === 'reserved-free' || table.status === 'reserved-busy') && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    marginTop: '-15px', 
                    marginBottom: '30px' }}>
                    <button 
                        className="small-button"
                        onClick={() => setShowReservationDetails(true)}
                    >
                        Show Details
                    </button>
                </div>
            )}

            <div>
                <div>Total Orders: {orderCount}</div>
            </div>

            <div className="table-items">
                <p> Items:</p>
            </div>
                    
            <ConfirmationModalItem 
                show={showConfirmationModal}
                message={"Are you sure you want to free this table?"}
                onConfirm={confirmFreeTable}
                onCancel={() => setShowConfirmationModal(false)}
            />

            {showReservationDetails && (
                <ReservationDetailsModal
                    show={showReservationDetails}
                    table={table}
                    onClose={() => setShowReservationDetails(false)}
                />
            )}


        </div>
    );
};

export default TableInterface;
