// frontend/src/components/Tables/TableBox.js

import React from 'react';

const TableBox = ({ table, onUpdateStatus }) => {
    const handleTableClick = () => {
        // Logic to display options to change status based on the current status
        if (table.status === 'FREE') {
            onUpdateStatus(table._id, 'BUSY');
        } else if (table.status === 'BUSY') {
            onUpdateStatus(table._id, 'FREE');
        } // ... Add logic for RESERVED status
    };

    const tableColor = {
        FREE: 'green',
        BUSY: 'red',
        RESERVED: 'yellow'
    };

    return (
        <div style={{ backgroundColor: tableColor[table.status] }} onClick={handleTableClick}>
            Table #{table.number}
        </div>
    );
};

export default TableBox;
