// src/dashboard/dashFunctions/OrderInterface.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToOrder, removeItemFromOrder, selectOrder } from '../../slices/dashSlice.js';

const OrderInterface = ({ categories }) => {
  const dispatch = useDispatch();
  const order = useSelector(selectOrder); // Get the order from Redux store

  const [currentCategory, setCurrentCategory] = useState(null);
  const [menuItems, setMenuItems] = useState({});

  // Fetch categories and items from the backend, this should be passed down as props or fetched within this component
  useEffect(() => {
    // Placeholder for fetching logic
    // setMenuItems(fetchedItems);
  }, [currentCategory]);

  const handleAddToOrder = (item) => {
    dispatch(addItemToOrder({ itemId: item.id, item }));
  };

  const handleRemoveFromOrder = (itemId) => {
    dispatch(removeItemFromOrder({ itemId }));
  };

  const calculateTotal = () => {
    return Object.values(order).reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <div className="menu-categories">
        {categories.map((category) => (
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
        <div className="total">
          <span>Total: €{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderInterface;
