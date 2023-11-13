// src/components/Orders/SearchOrders.js
import React, { useState } from 'react';
import api from '../../api';

const SearchOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        // Implement the search logic here based on the searchQuery
        // This could be either a client-side search if all orders are already fetched
        // Or a server-side search, requiring an API call with the searchQuery as a parameter
        api.get(`/orders/search?query=${searchQuery}`)
           .then(response => {
               setSearchResults(response.data);
           })
           .catch(error => {
               console.error("Error searching orders:", error);
           });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {/* Render search results */}
        </div>
    );
};

export default SearchOrders;
