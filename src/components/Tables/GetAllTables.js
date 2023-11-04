/* eslint-disable no-unused-vars */
// src/components/Tables/GetAllTables.js
import api from "../../api";
import { useState, useEffect } from "react";
import '../../styles/menuItem.css';

const GetAllTables = () => {
    const [tables, setTables] = useState([]);
    const [stats, setStats] = useState({});
    const [showDetails, setShowDetails] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("All");

    useEffect(() => {
        api.get('/tables')
           .then(response => {
               setTables(response.data.tables);
               setStats(response.data.stats);
           })
           .catch(error => {
               console.error("Error fetching tables:", error);
           });
    }, []);

    const chunkArray = (array, size) => {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    };

    const renderTableNumbers = (status) => {
        const tableNumbers = tables.filter(t => t.status === status).map(t => t.tableNumber);
        const chunkedTableNumbers = chunkArray(tableNumbers, 10);
        return chunkedTableNumbers.map((chunk, idx) => (
            <div key={idx}>{chunk.join(', ')}</div>
        ));
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setShowDetails(status === "All");
    };

    return (
        <div>
            <h3 style={{ 
                textAlign: 'center' 
            }}>All Tables: {tables.length}</h3>

            <div style={{ 
                display: 'flex', 
                marginBottom: '50px', 
                marginTop: '20px', 
                marginLeft: '20px', 
                marginRight: '20px',
                justifyContent: 'space-between' 
                }}>
                <button 
                    className={`table-status-buttons ${selectedStatus === "Free" ? "table-status-buttons-selected" : ""}`} 
                    onClick={() => handleStatusChange("Free")}>
                    Free
                </button>
                <button 
                    className={`table-status-buttons ${selectedStatus === "Busy" ? "table-status-buttons-selected" : ""}`} 
                    onClick={() => handleStatusChange("Busy")}>
                    Busy
                </button>
                <button 
                    className={`table-status-buttons ${selectedStatus === "Reserved" ? "table-status-buttons-selected" : ""}`} 
                    onClick={() => handleStatusChange("Reserved")}>
                    Reserved
                </button>
                <button 
                    className={`table-status-buttons ${selectedStatus === "All" ? "table-status-buttons-selected" : ""}`} 
                    onClick={() => handleStatusChange("All")}>
                    All
                </button>
            </div>
            {selectedStatus !== "All" && (
                <div>
                    <strong>{selectedStatus} Tables:</strong>
                    {renderTableNumbers(selectedStatus.toLowerCase())}
                </div>
            )}
            {showDetails && (
                <div>
                    <h6>TABLE STATUS BY #:</h6>
                    <div>
                        <strong>Free:</strong>
                        {renderTableNumbers('free')}
                    </div>
                    <div>
                        <strong>Busy:</strong>
                        {renderTableNumbers('busy')}
                    </div>
                    <div>
                        <strong>Reserved:</strong>
                        {renderTableNumbers('reserved')}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetAllTables;