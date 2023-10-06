import React, { useState } from 'react';
import axios from 'axios';

import { ConfirmationModal } from '../../components/Modals.js';
import { displayMessage } from '../../utils/usefulFunc';

const RemoveUser = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleRemove = async () => {
    try {
      const response = await axios.delete(`/api/users/delete/${userId}`);
      setMessage(response.data.message || 'User removed successfully!');
    } catch (error) {
      setMessage(error.response.data.message || 'Error removing user.');
    }
  };

  return (
    <div>
      <h2>Remove User</h2>
      <div>
        <label>User ID: </label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </div>
      <button onClick={handleRemove}>Remove User</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RemoveUser;
