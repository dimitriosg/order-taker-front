// src/components/Menu/GetAllMenuItems.js
import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import '../../styles/menuItem.css';

const GetAllMenuItems = () => {
    const [menuItems, setMenuItems] = useState({});

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
            {Object.keys(menuItems).map(category => (
                <div key={category} className="category-section">
                    <h3>{category}</h3>
                    <ul>
                        {menuItems[category].map(item => (
                            <li key={item._id}>
                                {item.name} - ${item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default GetAllMenuItems;
