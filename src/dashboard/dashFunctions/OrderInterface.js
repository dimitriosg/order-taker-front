// src/dashboard/dashFunctions/OrderInterface.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addItemToOrder, 
    removeItemFromOrder, 
    selectOrder } 
from '../../slices/dashSlice.js';

const OrderInterface = ({ table, categories }) => {
  const dispatch = useDispatch();
  const order = useSelector(selectOrder); // Get the order from Redux store

  const [currentCategory, setCurrentCategory] = useState(null);
  const [menuItems, setMenuItems] = useState({});

  // Fetch categories and items from the backend, this should be passed down as props or fetched within this component
  useEffect(() => {
    // Placeholder for fetching logic
    // setMenuItems(fetchedItems);
  }, [currentCategory]);

  if (!order) {
    // Log the error or handle it appropriately
    console.error('Order state is undefined');
    // Return a loading state or null to avoid rendering with undefined state
    return <div>Loading order data...</div>;
  }

  const handleAddToOrder = (item) => {
    dispatch(addItemToOrder({ itemId: item.id, item }));
  };

  const handleRemoveFromOrder = (itemId) => {
    dispatch(removeItemFromOrder({ itemId }));
  };

  const calculateTotal = () => {
    const orderValues = Object.values(order || {});
    return orderValues.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // If order is undefined, you can show a message or loading indicator
  if (!order) {
    return <div>Loading...</div>; // Show loading state if order is not yet available
  }

  return (
    <div>
        {/* Display table name and status */}
        <div className="table-details">
            <h2>Table: T{table.tableNumber} - Status: {table.status}</h2>
            <div>Total Orders: {Object.keys(order).length}</div>
        </div>

      <div className="menu-categories">
        {categories && categories.map((category) => (
          <button key={category.id} onClick={() => setCurrentCategory(category)}>
            {category.name}
          </button>
        ))}
      </div>
      <div className="menu-items">
        {menuItems[currentCategory]?.map((item) => (
          <div key={item.id} className="menu-item">
            <span>{item.name} - €{item.price.toFixed(2)}</span>
            <button onClick={() => handleAddToOrder(item)}>+</button>
            {order[item.id] && (
              <>
                <span>{order[item.id].quantity}x</span>
                <button onClick={() => handleRemoveFromOrder(item.id)}>-</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="current-order">
        {Object.values(order).map((item) => (
          <div key={item.id} className="order-item">
            <span>{item.name} - €{item.price.toFixed(2)} (x {item.quantity})</span>
            <button onClick={() => handleAddToOrder(item)}>+</button>
            <button onClick={() => handleRemoveFromOrder(item.id)}>-</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderInterface;
