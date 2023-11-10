// src/components/Tables/ReservedTables.js
import api from "../../api";
import { useState, useEffect } from "react";
import '../../styles/menuItem.css';

const ReservedTables = () => {
    const [reservedTables, setReservedTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");  

    useEffect(() => {
        fetchReservedTables();
    }, []);

    const fetchReservedTables = () => {
        api.get('/tables/reserved')
           .then(response => {
               setReservedTables(response.data);
           })
           .catch(error => {
               console.error("Error fetching reserved tables:", error);
           });
    };

    const handleModifySubmit = (tableId, updatedData) => {
        api.put(`/tables/modify-reservation/${tableId}`, updatedData)
           .then(() => {
               fetchReservedTables(); // Refresh data after modification
               setSelectedTable(null); // Close the form after modification
           })
           .catch(error => {
                console.error("Error modifying reservation:", error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    };

    const handleCancel = (tableId) => {
        api.put(`/tables/cancel-reservation/${tableId}`)
           .then(() => {
               fetchReservedTables(); // Refresh data after cancellation
           })
           .catch(error => {
               console.error("Error cancelling reservation:", error);
           });
    };

    const ModifyReservationForm = ({ table, onSubmit, onClose }) => {
        // When initializing the formData:
        const [formData, setFormData] = useState({
            name: table.reservation.name,
            phone: table.reservation.phone,
            time: table.reservation.reservedAt,       // Directly use the saved text
            holdingTime: table.reservation.releaseAt  // Directly use the saved text
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            const reservedAt = formData.time;
            const releaseAt = formData.holdingTime;        
            console.log({ ...formData, reservedAt, releaseAt });
            onSubmit(table._id, { ...formData, reservedAt, releaseAt });
        };

        return (
            <div className="modify-form-container">
                <h4 style={{ textAlign: 'center' }}>
                    Modify Reservation <br /> 
                    Table #{table.tableNumber}</h4>
                <form 
                    onSubmit={handleSubmit}
                    style={{ 
                        width: "60%", 
                        padding: "10px", 
                        marginBottom: "20px", 
                        marginLeft: "20%" }}
                >
                    <label>Name:</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label>Phone:</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <label>Time:</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                    />
                    <label>Hold Until:</label>
                    <input
                        type="time"
                        name="holdingTime"
                        value={formData.holdingTime}
                        onChange={handleChange}
                    />
                    <div className="modify-form-buttons">
                        <button className="small-button" type="submit">Update Reservation</button>
                        <button className="small-button" type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        );
    };

    let filteredTables = reservedTables;
    if (searchQuery.length >= 2) {
        filteredTables = reservedTables.filter(table => {
            return (
                (table.reservation.name && table.reservation.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (table.reservation.phone && table.reservation.phone.includes(searchQuery)) ||
                (table.reservation.reservedAt && table.reservation.reservedAt.includes(searchQuery))
                );
        });
    }

    return (
    <div>
        <input
            type="text"
            placeholder="Search by name, phone or time"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "60%", padding: "10px", marginBottom: "20px", marginLeft: "20%" }}
        />

        <h3 style={{ textAlign: 'center' }}>
            Reserved Tables ({reservedTables.length})
        </h3>

        <div className="reservation-container">
            {filteredTables.length > 0 ? 
                filteredTables.map(table => {
                    return (
                        <div className="reservation-item" key={table._id}>
                            <div className="table-number">Table {table.tableNumber}</div>
                            <div>Name: {table.reservation.name}</div>
                            <div>Phone: {table.reservation.phone}</div>
                            <div>Time: {table.reservation.reservedAt}</div> {/* Directly display the saved time */}
                            <div>Hold Until: {table.reservation.releaseAt}</div> {/* Directly display the saved time */}
                            <div className="reservation-buttons">
                                <button className="small-button" onClick={() => setSelectedTable(table)}>MODIFY</button>
                                <button className="small-button" onClick={() => handleCancel(table._id)}>CANCEL</button>
                            </div>
                        </div>
                    )
                })
            : (searchQuery.length >= 2 && <div>No results found</div>)}
        </div>
        {selectedTable && (
            <ModifyReservationForm 
                table={selectedTable}
                onSubmit={handleModifySubmit}
                onClose={() => setSelectedTable(null)}
            />
        )}
    </div>
);

};

export default ReservedTables;
