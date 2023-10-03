import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import roleSwitchReducer from '../slices/roleSwitchSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    roleSwitch: roleSwitchReducer,
  },
});

export default store;
