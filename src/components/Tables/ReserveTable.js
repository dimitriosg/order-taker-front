// src/components/Tables/ReserveTable.js
import api from "../../api";
import { useState, useEffect } from "react";

const ReserveTable = () => {
    const [freeTables, setFreeTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [reserverName, setReserverName] = useState('');
    const [message, setMessage] = useState('');


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        tableId: '',
        date: '',
        hour: '',
        holdingTime: 30 // default holding time in minutes
    });

    useEffect(() => {
        // Fetch free tables
        api.get('/tables/free')
           .then(response => {
               setFreeTables(response.data);
           })
           .catch(error => {
               console.error("Error fetching free tables:", error);
           });
    }, []);
    

    const handleReserve = () => {
        const adjustedTime = formData.hour;
    
        const adjustedFormData = {
            ...formData,
            reservedAt: adjustedTime
        };
    
        api.post('/tables/reserve', adjustedFormData)
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error("Error reserving table:", error);
                setMessage("Failed to reserve table. Please try again.");
            });
    };    

    return (
        <div className="menu-item-form">
            <h3 style={{ textAlign: 'center' }}>
                Reserve a Table <br /> 
                ({freeTables.length} available)
            </h3>

            <input 
                type="text" 
                placeholder="Name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input 
                type="tel" 
                placeholder="Phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <select value={formData.tableId} 
                onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
            >
                {freeTables.map(table => (
                    <option key={table._id} value={table._id}>
                        Table {table.tableNumber}
                    </option>
                ))}
            </select>
            <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <input 
                type="time" 
                value={formData.hour} 
                onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
            />
            <button onClick={handleReserve}>Reserve</button>
            <p>{message}</p>
        </div>
    );
};

export default ReserveTable;
