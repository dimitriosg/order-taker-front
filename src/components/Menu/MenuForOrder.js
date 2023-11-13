// src/components/Menu/MenuForOrder.js
import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import '../../styles/menuItem.css';

const MenuForOrder = ({ onAddToOrder, onRemoveFromOrder, currentOrder }) => {
    const [menuItems, setMenuItems] = useState({});

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await api.get('/api/menuItems');
                const groupedItems = response.data.reduce((acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                }, {});
                setMenuItems(groupedItems);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };
        fetchMenuItems();
    }, []);

    return (
        <div className="all-menu-items">
            {Object.keys(menuItems).map(category => (
                <div key={category} className="category-section">
                    <h3>{category}</h3>
                    <ul>
                        {menuItems[category].map(item => {
                            // Find the item in the current order to get its quantity
                            const orderItem = currentOrder.items.find(orderItem => orderItem._id === item._id);
                            const quantity = orderItem ? orderItem.quantity : 0;

                            return (
                                <li key={item._id} className="menu-item">
                                    <span>[{quantity}] {item.name} {'>'} {item.price}€</span>
                                    <button onClick={() => onAddToOrder(item)} className="add-to-order-button">add</button>
                                    <button onClick={() => onRemoveFromOrder(item)} className="remove-from-order-button">remove</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default MenuForOrder;
