import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import roleSwitchReducer from '../slices/roleSwitchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    roleSwitch: roleSwitchReducer,
  },
});

export default store;
