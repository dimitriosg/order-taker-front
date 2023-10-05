// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import roleSwitchReducer from '../slices/roleSwitchSlice.js';
import dashboardReducer from '../slices/dashSlice.js';


const store = configureStore({
  reducer: {
    auth: authReducer,
    roleSwitch: roleSwitchReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
