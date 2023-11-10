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


const initialState = {
  all: [],
  assigned: [], 
  order: {},
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
  },
  extraReducers: {
    [fetchTables.fulfilled]: (state, action) => {
      state.all = action.payload.tables;
      state.assigned = action.payload.tables.filter(table => table.waiterId === 'currentWaiterId');
    },
    [fetchTables.rejected]: (state, action) => {
        // Handle the error state
    },
    [updateTableStatus.fulfilled]: (state, action) => {
        // Reducer logic remains the same...
    },
    [updateTableStatus.rejected]: (state, action) => {
        // Handle the error state
    },
    [updateTableStatus.fulfilled]: (state, action) => {
      const { tableId, status } = action.payload;
      const index = state.all.findIndex(table => table._id === tableId);
      if (index !== -1) {
        state.all[index].status = status;
      }
    },
    [fetchTableById.fulfilled]: (state, action) => {
      const fetchedTable = action.payload;
      const index = state.all.findIndex(table => table._id === fetchedTable._id);
      if (index !== -1) {
        state.all[index] = fetchedTable; // Update the table data in the state
      } else {
        state.all.push(fetchedTable); // Add the fetched table if it's not already in the state
      }
    },
    [fetchTableById.rejected]: (state, action) => {
      // Handle the error case
      // You can update the state to reflect the error
      // For example, setting an error message or flag
      state.fetchTableByIdError = action.error.message;
    },
  }
});

export const { addItemToOrder, removeItemFromOrder } = dashSlice.actions;

// Selectors
export const selectTables = (state) => state.dashboard.all;
export const selectAssignedTables = (state) => state.dashboard.assigned;
export const selectOrder = (state) => state.dashboard.order; 

export default dashSlice.reducer;
