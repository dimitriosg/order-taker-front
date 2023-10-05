// src/components/Menu/RemoveMenuItem.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/menuItem.css';


const RemoveMenuItem = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Fetch all menu items when the component mounts
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('/api/menuItems'); // Assuming you have an endpoint to fetch all menu items
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error.response.data);
            }
        }

        fetchMenuItems();
    }, []);

    const handleRemove = async (itemId) => {
        try {
            await axios.delete(`/api/menuItems/removeMenuItem/${itemId}`);
            setMenuItems(menuItems.filter(item => item._id !== itemId)); // Remove the item from local state
        } catch (error) {
            console.error("Error removing menu item:", error.response.data);
        }
    }

    return (
        <div className="menu-item-list">
            <h2>Remove Menu Item</h2>

            <ul>
                {menuItems.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.price}€ 
                        <button onClick={() => handleRemove(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RemoveMenuItem;
