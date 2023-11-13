// src/components/Orders/OrderBox.js
import React from 'react';
import '../../styles/OrderBox.css';

const OrderBox = ({ order, onOrderUpdate, onOrderCancel }) => {
    console.log("Received order in OrderBox:", order);

    const calculateOrderTotal = (items) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };    

    // Check if 'order' and 'order.items' exist and 'order.items' is not empty
    if (!order || !order.items || order.items.length === 0) {
        return <div className="order-box">No order details available.</div>;
    }
    
    const totalAmount = calculateOrderTotal(order.items);

    return (
        <div className="order-box">
            <h2>Order # <br /> 
                {order.orderID}
            </h2>
            <ul>
                {order.items.map((item, index) => (
                    <li key={item._id}> {/* Use a unique identifier */}
                        {item.quantity} x {item.name}: {(item.price * item.quantity).toFixed(2)}€
                    </li>
                ))}
            </ul>

            <p>
                Total Amount: {totalAmount.toFixed(2)}€ <br />
                Status: {order.status}
            </p>

            <span style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '15px',
                marginTop: '5px' 
            }}>
            </span>
        </div>
    );
};

export default OrderBox;
