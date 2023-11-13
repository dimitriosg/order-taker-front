// src/components/Orders/ListAllOrders.js
import React, { useState, useEffect } from 'react';
import api from '../../api';

const ListAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/orders'); // Adjust endpoint as needed
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (searchQuery) => {
        try {
            const response = await api.get(`/orders/search?query=${searchQuery}`);
            // Assuming the endpoint returns an array of orders matching the search query
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    const calculateSummary = () => {
        let totalOrders = orders.length;
        let totalCash = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        let reservedOrders = orders.filter(order => order.orderID.includes('YR')).length;
        let nonReservedOrders = totalOrders - reservedOrders;

        let reservedOrdersAmount = orders.filter(order => order.orderID.includes('YR'))
                                     .reduce((acc, order) => acc + order.totalAmount, 0);
        
        let nonReservedOrdersAmount = totalCash - reservedOrdersAmount;

        return { totalOrders, totalCash, reservedOrders, nonReservedOrders, reservedOrdersAmount, nonReservedOrdersAmount };
    };

    const summary = calculateSummary();

    if (isLoading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div>
            <h3 style={{ textAlign: 'center' }}
                >All Orders Summary
            </h3>            
            
            <span className='order-summary' style={{
                display: 'block', // Ensure span behaves like a block element
                opacity: summary.totalOrders === 0 ? 0.5 : 1,
                pointerEvents: summary.totalOrders === 0 ? 'none' : 'auto',
                margin: '30px',
                marginLeft: 'auto', // Center the span horizontally
                marginRight: 'auto',
                maxWidth: '80%', // Set a max-width to avoid span stretching too wide
                textAlign: 'left' // Align text to the left within the span
            }}>
                <p>Total Orders: {summary.totalOrders}</p>
                <p>Total Raised: €{summary.totalCash.toFixed(2)}</p>
                <p>Reserved Tables: {summary.reservedOrders} (Amount: €{summary.reservedOrdersAmount.toFixed(2)})</p>
                <p>Non-Reserved Tables: {summary.nonReservedOrders} (Amount: €{summary.nonReservedOrdersAmount.toFixed(2)})</p>
            </span>
            {/* Render list of orders */}
        </div>
    );   
};

export default ListAllOrders;
