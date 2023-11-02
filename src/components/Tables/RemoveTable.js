// src/components/Tables/RemoveTable.js
import api from "../../api";
import { useState } from "react";

const RemoveTable = () => {
    const [tablesToDelete, setTablesToDelete] = useState(0);
    const [tableActionMessage, setTableActionMessage] = useState('');

    const handleDeleteTables = () => {
        api.delete(`/tables/delete/${tablesToDelete}`)
           .then(response => {
               setTableActionMessage(response.data.message);
           })
           .catch(error => {
            console.error("Error details:", error.response ? error.response.data : error);
               setTableActionMessage("Error deleting tables. Please try again.");
           });
    };

    return (
        <div>
            <label className="label-table">Tables to Delete: </label>
            <input id="tablesToDelete" type="number" value={tablesToDelete} onChange={(e) => setTablesToDelete(Number(e.target.value))} />
            <button onClick={handleDeleteTables}>Delete Tables</button>
            <p>{tableActionMessage}</p>
        </div>
    );
};

export default RemoveTable;