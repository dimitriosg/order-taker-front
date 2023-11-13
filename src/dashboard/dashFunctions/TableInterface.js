// src/dashboard/dashFunctions/TableInterface.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectOrder, 
    updateTableStatus, 
    fetchOrdersForTable, 
    placeNewOrder, 
    addNewOrder
} from '../../slices/dashSlice.js';
import { ConfirmationModalItem, ReservationDetailsModal } from '../../components/Modals.js';

import api from '../../api.js';

import OrderBox from '../../components/Orders/OrderBox.js';
import MenuForOrder from '../../components/Menu/MenuForOrder.js';

import './dashFuncStyles/TableInterface.css';
//import { isAction } from '@reduxjs/toolkit';

const TableInterface = ({ table: initialTable, onBackButtonClick }) => {
    const dispatch = useDispatch();

    const [table, setTable] = useState(initialTable);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showReservationDetails, setShowReservationDetails] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [currentOrder, setCurrentOrder] = useState({ items: [], orderID: '', status: 'created' });

    const orders = useSelector(selectOrder) || [];
    const activeOrders = orders.filter(order => order.status !== 'cancelled');
    const userEmail = useSelector(state => state.dashboard.email);

    useEffect(() => {
        if (table._id) dispatch(fetchOrdersForTable(table._id));
    }, [dispatch, table._id]);

    if (!userEmail) {
        console.error("User email is not defined");
        return null; // or handle this case as needed
    }

    const calculateTotalAmount = () => {
        return currentOrder.items.reduce((total, item) => total + item.totalPrice, 0);
    };    

    const handleStatusChange = async (newStatus) => {
        const updatedStatus = table.status.includes('reserved') && newStatus === 'busy' 
                                ? 'reserved-busy' 
                                : newStatus;
        await dispatch(updateTableStatus({ tableId: table._id, status: updatedStatus }));
        setTable({ ...table, status: updatedStatus });
    };

    const handleFreeTable = () => setShowConfirmationModal(true);
    
    const confirmFreeTable = () => {
        dispatch(updateTableStatus({ tableId: table._id, status: 'free' }));
        setTable({ ...table, status: 'free' });
        setShowConfirmationModal(false);
    };

    // Initialize the current order with an empty items array
    const handlePlaceOrderClick = async () => {
        setIsPlacingOrder(true);

        try {
            const response = await api.get(`/orders/generateOrderNumber?tableNumber=${initialTable.tableNumber}&isReserved=${initialTable.status.includes('reserved')}`);
            const generatedOrderId = response.data;

            setCurrentOrder({
                items: [],
                orderID: generatedOrderId,
                status: 'pending'
            });

        } catch (error) {
            console.error("Error generating order number:", error);
        }
    };

    // Submit the current order
    const handleSubmitOrder = async () => {
        console.log('Submitting order:', currentOrder);
        setIsPlacingOrder(true);

        // Prepare the order data without the orderID
        const orderData = {
            tableId: table._id,
            items: 
                currentOrder.items.map(({ _id, name, price, quantity }) => ({
                _id, name, price, quantity
            })),waiterID: userEmail,
            orderID: currentOrder.orderID,
            status: 'created'
        };

        dispatch(placeNewOrder(orderData))
        .then(action => {
            if (placeNewOrder.fulfilled.match(action)) {
                console.log('New Order Response:', action.payload);
                dispatch(addNewOrder(action.payload)); // Update the Redux state
                console.log('Order placed successfully');
            } else {
                console.error('Failed to place order', action.error);
            }
            setIsPlacingOrder(false);
        });
    };

    const handleCancelOrder = async () => {
        console.log('Cancelling order:', currentOrder.orderID);
        setIsPlacingOrder(false);

        try {
            // Send a request to update the order status to 'cancelled'
            await api.patch(`/orders/update/${currentOrder.orderID}`, { status: 'cancelled' });

            // Reset current order to initial state
            setCurrentOrder({ items: [], orderID: '', status: 'cancelled' });
            console.log('Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleAddToOrder = (menuItem) => {
        setCurrentOrder(currentOrder => {
            // Find if the item already exists in the order
            const existingItemIndex = currentOrder.items.findIndex(item => item._id === menuItem._id);
    
            let updatedItems = [...currentOrder.items]; // Create a shallow copy of the items
    
            if (existingItemIndex > -1) {
                // Update the quantity and total price of the existing item
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                    totalPrice: (updatedItems[existingItemIndex].quantity + 1) * updatedItems[existingItemIndex].price
                };
            } else {
                // Add the new item
                updatedItems.push({
                    ...menuItem,
                    quantity: 1,
                    totalPrice: menuItem.price
                });
            }
    
            // Return the updated order
            return { ...currentOrder, items: updatedItems };
        });
    };

    const handleRemoveFromOrder = (menuItem) => {
        setCurrentOrder(currentOrder => {
            const existingItemIndex = currentOrder.items.findIndex(item => item._id === menuItem._id);
    
            if (existingItemIndex === -1) {
                // Item not in order, nothing to remove
                return currentOrder;
            }
    
            let updatedItems = [...currentOrder.items];
            if (updatedItems[existingItemIndex].quantity > 1) {
                // Decrease the quantity
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity - 1,
                    totalPrice: (updatedItems[existingItemIndex].quantity - 1) * updatedItems[existingItemIndex].price
                };
            } else {
                // Remove the item from the order
                updatedItems.splice(existingItemIndex, 1);
            }
    
            return { ...currentOrder, items: updatedItems };
        });
    }
    

    const renderStatus = () => {
        if (table.status === 'reserved-free') return <span className="status-reserved-free">reserved (free)</span>;
        if (table.status === 'reserved-busy') return <span className="status-reserved-busy">reserved (busy)</span>;
        return <span className={`status-${table.status.toLowerCase()}`}>{table.status}</span>;
    };

    console.log("Active Orders for rendering:", activeOrders);

    activeOrders.forEach(order => console.log("Rendering order:", order));

    return (
        <div className="table-interface">
            <div className='back-and-change-status' 
                style={{ 
                    display: isPlacingOrder ? 'none' : 'flex', 
                    justifyContent: 'center', 
                    marginBottom: '30px' 
                }}>
                {/* Back Button */}
                <button onClick={onBackButtonClick}>Back</button>
                
                {/* Show Occupy button for free and reserved-free tables */}
                {(table.status === 'free' || table.status === 'reserved-free') && (
                    <button id="occupy-table" onClick={() => handleStatusChange('busy')}>Occupy</button>
                )}

                {/* Show Place Order and Free Table buttons for busy and reserved-busy tables */}
                {(table.status === 'busy' || table.status === 'reserved-busy') && (
                    <>
                        <button id="place-order" onClick={handlePlaceOrderClick}>Place Order</button>
                        <button id="free-table" onClick={handleFreeTable}>Free Table</button>
                    </>
                )}

                {/* Fallback UI for unknown table status */}
                {!(table.status === 'free' || table.status === 'reserved-free' || table.status === 'busy' || table.status === 'reserved-busy') && (
                    <p>This table is: {table.status}</p>
                )}
            </div>
            
            {/* Table Details */}
            <div className="table-details">
                <h2>Table #{table.tableNumber} <br /> Status: {renderStatus()}</h2>
            </div>

            {/* Show Reservation Details Button */}
            {(table.status === 'reserved-free' || table.status === 'reserved-busy') && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-15px', marginBottom: '30px' }}>
                    <button className="small-button" onClick={() => setShowReservationDetails(true)}>Show Details</button>
                </div>
            )}

            {/* Display message if no orders */}
            {activeOrders.length === 0 && !isPlacingOrder && 
                <p id="no-orders"
                    style={{ textAlign: 'center' }}
                > No orders for this table.</p>
            }

            {/* Order Placement Interface */}
            {isPlacingOrder ? (
                <>
                    <br />
                    <div className="order-total">
                        <h3>Total Amount: {calculateTotalAmount().toFixed(2)}€</h3>
                    </div>
                    
                    <MenuForOrder 
                        onAddToOrder={handleAddToOrder} 
                        onRemoveFromOrder={handleRemoveFromOrder}
                        currentOrder={currentOrder} 
                    />

                    <OrderBox 
                        className="order-box"
                        order={currentOrder}
                        onOrderUpdate={handleAddToOrder}
                        onOrderCancel={handleCancelOrder}
                    />

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '15px', 
                        marginTop: '15px' 
                    }}>
                        <button 
                            onClick={handleSubmitOrder}
                            style={{ backgroundColor: 'lightgreen' }}
                        >Submit Order</button>

                        <button 
                            onClick={handleCancelOrder}
                            style={{ backgroundColor: 'lightcoral' }}
                        >Cancel Order</button>
                    </div>
                </>
            ) : (            
                // Display existing orders
                activeOrders.length > 0 && (
                    activeOrders.map((order, index) => (
                        <OrderBox 
                            key={index} 
                            order={order} 
                            onOrderUpdate={handleAddToOrder} 
                            onOrderCancel={handleCancelOrder} 
                        />
                    ))
                )
            )}

            {/* Confirmation Modal for Freeing Table */}
            <ConfirmationModalItem show={showConfirmationModal} message={"Are you sure you want to free this table?"} onConfirm={confirmFreeTable} onCancel={() => setShowConfirmationModal(false)} />
            
            {/* Reservation Details Modal */}
            {showReservationDetails && <ReservationDetailsModal show={showReservationDetails} table={table} onClose={() => setShowReservationDetails(false)} />}
        </div>
    );
};

export default TableInterface;
