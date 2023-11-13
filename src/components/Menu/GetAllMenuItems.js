/* eslint-disable no-unused-vars */
// src/components/Menu/GetAllMenuItems.js
import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import '../../styles/menuItem.css';

const GetAllMenuItems = ({ onAddToOrder }) => {
    const [menuItems, setMenuItems] = useState({});
    const [showImages, setShowImages] = useState(true);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await api.get('/api/menuItems');  // Assuming this endpoint returns all menu items.
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
            <div style={{ 
                textAlign: 'right', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end' }}>
                <span style={{ 
                    marginRight: '20px',
                    fontWeight: '600',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                    color: '#333',
                    fontSize: '0.95em',
                    letterSpacing: '0.5px'
                }}>
                </span>
            </div>

            {Object.keys(menuItems).map(category => (
                <div key={category} className="category-section">
                    <h3 style={{ textAlign: 'center' }}>{category}</h3>
                    <ul style={{ paddingLeft: '30px' }}>
                        {menuItems[category].map(item => (
                            <li key={item._id}>
                                {item.name} {'>'} {item.price}€
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

        </div>
    );
}

export default GetAllMenuItems;
