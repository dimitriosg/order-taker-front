// src/dashboard/dashFunctions/TableInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectOrder, 
    updateTableStatus, 
    fetchOrdersForTable, 
    placeNewOrder, 
    addNewOrder
} from '../../slices/dashSlice.js';

import { 
    ConfirmationModalItem, 
    ReservationDetailsModal 
} from '../../components/Modals.js';

import api from '../../api.js';

import OrderBox from '../../components/Orders/OrderBox.js';
import MenuForOrder from '../../components/Menu/MenuForOrder.js';

import './dashFuncStyles/TableInterface.css';


const TableInterface = ({ table: initialTable, onBackButtonClick }) => {
    const dispatch = useDispatch();

    const [table, setTable] = useState(initialTable);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showReservationDetails, setShowReservationDetails] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [currentOrder, setCurrentOrder] = useState({ 
        items: [], orderID: '', status: 'pending' });

    // for countdown cancellation
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const countdownTimer = useRef(null);

    // New state to track background countdown orders
    //const [backgroundCountdownOrders, setBackgroundCountdownOrders] = useState({});


    const orders = useSelector(selectOrder) || [];
    const activeOrders = orders.filter(order => order.status !== 'cancelled');
    const userEmail = useSelector(state => state.dashboard.email);

    console.log('ON TOP: ActiveOrders:', activeOrders);
    console.log('COUNT of ActiveOrders:', activeOrders.length);

    console.log('ActiveOrders:', activeOrders);
    console.log('(ActiveOrders) Is Placing Order:', isPlacingOrder);



    useEffect(() => {
        if (table._id) dispatch(fetchOrdersForTable(table._id));
    }, [dispatch, table._id]);

    if (!userEmail) {
        console.error("User email is not defined");
        return null; // or handle this case as needed
    }

    const calculateTotalAmount = () => {
        if (currentOrder.items && currentOrder.items.length > 0) {
            return currentOrder.items.reduce((total, item) => {
                return total + (item.totalPrice ? item.totalPrice : 0);
            }, 0);
        } else {
            return 0;
        }
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

            // Prepare the data for the new order
            const newOrderData = {
                tableId: initialTable._id,
                items: [],
                waiterID: userEmail,
                orderID: generatedOrderId,
                status: 'pending'
            };

            // Send a request to create the new order
            const createOrderResponse = await api.post(`/orders/table/${initialTable._id}`, newOrderData);
            console.log('New order created:', createOrderResponse.data);

            setCurrentOrder({
                items: [],
                orderID: generatedOrderId,
                status: 'pending'
            });

        } catch (error) {
            console.error("Error in handlePlaceOrderClick:", error);
            setIsPlacingOrder(false);
        }
    };

    // Submit the current order
    const handleSubmitOrder = async () => {
        console.log('Submitting order:', currentOrder);
        setIsPlacingOrder(true);
        setIsProcessingOrder(true);
        setCountdown(60);

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

        // Send a request to create the order with 'created' status
        try {
            const response = await api.patch(`/orders/update/${currentOrder.orderID}`, orderData);
            console.log('Order created:', response.data);
            setCurrentOrder({ ...currentOrder, status: 'created' });
        } catch (error) {
            console.error('Error creating order:', error);
            setIsPlacingOrder(false);
            setIsProcessingOrder(false);
            return; // Exit the function if there's an error
        }

        // Start countdown
        countdownTimer.current = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(countdownTimer.current);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        // Set timeout for submitting the order
        const submitOrderTimeout = setTimeout(async () => {
            clearInterval(countdownTimer.current);
            setIsProcessingOrder(false);

            // Update the order status to 'sent'
            try {
                await api.patch(`/orders/update/${currentOrder.orderID}`, { status: 'sent' });
                console.log('Order status updated to sent');
                setCurrentOrder({ ...currentOrder, status: 'sent' });
            } catch (error) {
                console.error('Error updating order status to sent:', error);
            }
            
            setIsPlacingOrder(false);
        }, 60000);

        // Save the timeout ID for cancellation
        currentOrder.submitOrderTimeout = submitOrderTimeout;
    };

    const handleCancelOrderDuringProcessing = async () => {
        clearInterval(countdownTimer.current);
        setIsProcessingOrder(false);
    
        // Cancel the order submission if it's scheduled
        if (currentOrder.submitOrderTimeout) {
            clearTimeout(currentOrder.submitOrderTimeout);
            delete currentOrder.submitOrderTimeout; // Remove the timeout reference
        }
    
        // Update the order status to 'pending' on the server
        try {
            await api.patch(`/orders/update/${currentOrder.orderID}`, { status: 'pending' });
            console.log('Order status updated to pending');
        } catch (error) {
            console.error('Error updating order status to pending:', error);
            // Optionally handle the error, e.g., show a message to the user
        }

        // Update the local state to reflect the 'pending' status
        setCurrentOrder(currentOrder => ({ ...currentOrder, status: 'pending' }));
    };

    const handleClearOrder = () => {
        setCurrentOrder({
            ...currentOrder,
            items: [],
            status: 'pending'
        });
    }

    const handleBack = () => {
        // If needed, stop any ongoing processes
        clearInterval(countdownTimer.current);
        setIsProcessingOrder(false);
        setIsPlacingOrder(false);
    
        onBackButtonClick(table);
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
                    marginBottom: '30px', 
                    gap: '20px',
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
                        <h3>Total Amount: {typeof calculateTotalAmount() === 'number' ? calculateTotalAmount().toFixed(2) : '0.00'}€</h3>
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
                        countdown={countdown}
                        isProcessing={isProcessingOrder}
                    />

                    {/* Butto to CLEAR the order */}
                    {!isProcessingOrder && (
                        <button
                            onClick={handleClearOrder}
                            style={{
                                display: 'block',
                                margin: 'auto',
                                backgroundColor: 'grey',
                                marginTop: '15px',
                                marginBottom: '15px',
                                width: '50%',
                                padding: '10px',
                                borderRadius: '5px',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >Clear Order</button>
                    )}

                    {/* Display countdown and cancel button during order processing */}
                    {isProcessingOrder ? (
                        <div>
                            <p
                                style={{
                                    textAlign: 'center',
                                }}
                            >Order processing... {countdown} seconds remaining</p>

                            <div className='during-processing-container'>
                                <button 
                                    className='cancel-button-during-processing'
                                    onClick={handleCancelOrderDuringProcessing}
                                >Stop Order</button>

                                <button
                                    className='back-button-during-processing'
                                    onClick={handleBack}
                                >Back to Table</button>
                            </div>
                        </div>
                    ) : (
                        // Show submit and cancel buttons only when not processing
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
                    )}
                </>
            ) : (            
                    activeOrders.length === 0 && !isPlacingOrder ? (
                        <p id="no-orders" style={{ 
                            textAlign: 'center' 
                        }}>No orders for this table.</p>
                    ) : (
                        activeOrders.map((order, index) => (
                            <OrderBox 
                                key={index} 
                                order={order} 
                                onOrderUpdate={handleAddToOrder} 
                                onOrderCancel={handleCancelOrder} 
                                onCancelOrderProcessing={handleCancelOrderDuringProcessing}
                                countdown={countdown}
                                isProcessing={isProcessingOrder}
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
