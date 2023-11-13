// src/redux/dashSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js'; 

export const fetchTables = createAsyncThunk('dashboard/fetchTables', async () => {
  const response = await api.get('/tables');
  return response.data;
});

export const updateTableStatus = createAsyncThunk('dashboard/updateTableStatus', async ({ tableId, status }) => {
  await api.patch(`/tables/${tableId}/status`, { status });
  return { tableId, status };
});

export const fetchTableById = createAsyncThunk('dashboard/fetchTableById', async (tableId) => {
  const response = await api.get(`/tables/${tableId}`);
  return response.data;
});

export const fetchOrdersForTable = createAsyncThunk('dashboard/fetchOrdersForTable', async (tableId) => {
  // Implement API call to fetch orders for a table
  const response = await api.get(`/orders/fromTable/${tableId}`);
  return response.data;
});

export const fetchMenuItems = createAsyncThunk('dashboard/fetchMenuItems', async () => {
  const response = await api.get('/menu');
  return response.data;
});

export const placeNewOrder = createAsyncThunk('dashboard/placeNewOrder', async (orderData, { rejectWithValue }) => {
  try {
      const response = await api.post(`/orders/table/${orderData.tableId}`, orderData);
      return response.data;
  } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error placing new order');
  }
});


const initialState = {
  all: [],
  assigned: [], 
  order: [],
  menuItems: [],
  email: null,
};	

// Slice
const dashSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addItemToOrder: (state, action) => {
      const { itemId, item } = action.payload;
      if (state.order[itemId]) {
        state.order[itemId].quantity += 1;
      } else {
        state.order[itemId] = { ...item, quantity: 1 };
      }
    },
    removeItemFromOrder: (state, action) => {
      const { itemId } = action.payload;
      if (state.order[itemId] && state.order[itemId].quantity > 1) {
        state.order[itemId].quantity -= 1;
      } else {
        delete state.order[itemId];
      }
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    addNewOrder: (state, action) => {
      const existingOrderIndex = state.order.findIndex(o => o.orderID === action.payload.orderID);
      if (existingOrderIndex !== -1) {
        // Replace existing order
        state.order[existingOrderIndex] = action.payload;
      } else {
        // Add new order
        state.order.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.all = action.payload.tables;
        state.assigned = action.payload.tables.filter(table => table.waiterId === 'currentWaiterId');
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
          const { tableId, status } = action.payload;
          const index = state.all.findIndex(table => table._id === tableId);
          if (index !== -1) {
              state.all[index].status = status;
          }
      })
      .addCase(fetchTableById.fulfilled, (state, action) => {
        const fetchedTable = action.payload;
        const index = state.all.findIndex(table => table._id === fetchedTable._id);
        if (index !== -1) {
          state.all[index] = fetchedTable; // Update the table data in the state
        } else {
          state.all.push(fetchedTable); // Add the fetched table if it's not already in the state
        }
      })
      .addCase(fetchOrdersForTable.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.menuItems = action.payload;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.order.push(action.payload);
      });
  }
});

export const { 
  addItemToOrder, 
  removeItemFromOrder, 
  setUserEmail, 
  addNewOrder,
} = dashSlice.actions;

// Selectors
export const selectTables = (state) => state.dashboard.all;
export const selectAssignedTables = (state) => state.dashboard.assigned;
export const selectOrder = (state) => state.dashboard.order; 

export default dashSlice.reducer;
