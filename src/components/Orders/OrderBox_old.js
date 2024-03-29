// src/components/Orders/OrderBox_old.js
import React from 'react';
import '../../styles/OrderBox.css';  // Import the CSS

const OrderBox = ({ tableData }) => {
    const calculateOrderTotal = (items) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const tableTotal = tableData.orders.reduce((acc, order) => acc + calculateOrderTotal(order.items), 0);

    const handleMarkAsServed = (orderId) => {
        // Make API call or dispatch an action to mark the order as served
        console.log(`Mark order ${orderId} as served.`);
        // TODO: Implement this functionality
    };

    return (
        <div className="order-box">
            <h2>{tableData.tableName}</h2>
            {tableData.orders.map((order, index) => (
                <div key={index}>
                    <div className="order-header">
                        Order #{order.orderId} <br />
                        status: <span className="item-status">{order.status}</span>
                        <button onClick={() => handleMarkAsServed(order.orderId)}>Mark as Served</button>
                        <hr />
                    </div>
                    <ul>
                        {order.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="order-item no-border">
                                <span className="item-name">{item.quantity} x {item.name}</span>
                                <span>{item.price * item.quantity}€</span>
                            </li>
                        ))}
                    </ul>
                    <div className="order-total">General Total: {calculateOrderTotal(order.items)}€</div>
                    <hr id="order-divider"/>
                </div>
            ))}
            <div className="table-total">Table Total: {tableTotal}€</div>
        </div>
    );
};

export default OrderBox;