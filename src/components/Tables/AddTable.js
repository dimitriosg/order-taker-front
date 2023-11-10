// src/components/Tables/AddTable.js
import api from "../../api.js";
import { useState } from "react";

const AddTable = () => {
    const [tablesToCreate, setTablesToCreate] = useState(0);
    const [tableActionMessage, setTableActionMessage] = useState('');

    const handleCreateTables = () => {
        if (tablesToCreate <= 0 || isNaN(tablesToCreate)) {
            setTableActionMessage("Please enter a valid number of tables to create.");
            return;
        }
        
        console.log("Attempting to create tables with count:", tablesToCreate);

        api.post('/tables/create', { numberOfTables: tablesToCreate })
           .then(response => {
                console.log("Successfully created tables with response:", response.data);
               setTableActionMessage(response.data.message);
           })
           .catch(error => {
            console.error("Error details:", error.response ? error.response.data : error);
            console.error("Error creating tables:", error.response.data.message);
            setTableActionMessage("Error creating tables. Please try again.");
           });
    };

    return (
        <div>
            <label className="label-table">Tables to Create: </label>
            <input id="tablesToCreate" type="number" value={tablesToCreate} onChange={(e) => setTablesToCreate(Number(e.target.value))} />
            <button onClick={handleCreateTables}>Create Tables</button>
            <p>{tableActionMessage}</p>
        </div>
    );
};

export default AddTable;