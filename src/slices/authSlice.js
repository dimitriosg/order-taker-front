/* eslint-disable no-unused-vars */
// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { User } from '../types.ts';

const initialState = {
    token: null,
    role: null,
    userID: null,
    userName: null,
    userEmail: null,
    logoutSuccess: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            console.log("loginSuccess action called with payload:", action.payload);
            const { token, role, userId, userName, userEmail } = action.payload;

            state.token = token;
            state.role = role;
            state.userName = userName;
            state.userEmail = userEmail;

            // Update local storage here
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);
        },
        logout(state) {
            state.token = null;
            state.role = null;
            state.userName = null;
            state.logoutSuccess = true;
            
            // Clear local storage here
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userName');
        },
        resetLogoutSuccess(state) {
            state.logoutSuccess = false;
        },
        syncAuthState(state){
            state.token = localStorage.getItem('token');
            state.role = localStorage.getItem('role');
            state.userName = localStorage.getItem('userName');
        }
    },
});

export const { loginSuccess, logout, resetLogoutSuccess, syncAuthState } = authSlice.actions;
export default authSlice.reducer;
