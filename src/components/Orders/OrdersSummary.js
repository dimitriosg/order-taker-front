import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import api from '../../api.js'; // Assuming api is set up for making HTTP requests

function OrdersSummary({ tableId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [tableId]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/${tableId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  return (
    <ListGroup>
      {orders.map(order => (
        <ListGroup.Item key={order._id}>
          Order ID: {order.orderID}, Total: {order.totalAmount}€, Status: {order.status}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default OrdersSummary;
