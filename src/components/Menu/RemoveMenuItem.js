// src/components/Menu/RemoveMenuItem.js
import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import '../../styles/menuItem.css';
import { ConfirmationModal } from '../Modals.js';


const RemoveMenuItem = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [itemToRemove, setItemToRemove] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/menuItems/categories');  // This endpoint should return all categories.
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await api.get(`/api/menuItems?category=${selectedCategory}`);
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error.response ? error.response.data : error);
            }
        }
        fetchMenuItems();
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleRemove = (itemId) => {
        setItemToRemove(itemId);
        setShowConfirmModal(true);
    };

    const confirmRemove = async () => {
        try {
            await api.delete(`/api/menuItems/removeMenuItem/${itemToRemove}`);
            setMenuItems(menuItems.filter(item => item._id !== itemToRemove));

            setSuccessMessage("Item removed successfully!");  // Set success message
            setTimeout(() => {
                // Start fading out the message
                document.querySelector('.success-message').style.opacity = '0';
                // Clear the message after the transition ends (0.3s as set in the CSS)
                setTimeout(() => setSuccessMessage(''), 300);
            }, 2700);
        } catch (error) {
            console.error("Error removing menu item:", error.response ? error.response.data : error);
        }
        closeConfirmModal();
    };

    const closeConfirmModal = () => {
        setItemToRemove(null);
        setShowConfirmModal(false);
    };


    return (
        <div className="menu-item-list">
            <h2>Remove Menu Item</h2>

            {/* Display success message */}
            {successMessage && 
                <div className="success-message">{successMessage}
            </div>}  
            
            <select 
                value={selectedCategory} 
                onChange={(e) => handleCategoryChange(e.target.value)}
            >
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            {menuItems.map(item => (
                <li key={item._id}>
                    <div className="item-details">
                        {item.name} - {item.price}€ 
                    </div>
                    <button onClick={() => handleRemove(item._id)}>Delete</button>
                </li>
            ))}

            {/* The Confirmation Modal */}
            <ConfirmationModal 
                show={showConfirmModal} 
                message="Are you sure you want to remove this item from the menu?" 
                onConfirm={confirmRemove}
                onCancel={closeConfirmModal}
            />
        </div>
    );
}

export default RemoveMenuItem;
