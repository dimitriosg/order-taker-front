/* eslint-disable no-unused-vars */
// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { User } from '../types.ts';

const initialState = {
    token: null,
    role: null,
    userEmail: null,
    userName: null,
    logoutSuccess: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            console.log("(Slice)loginSuccess action called with payload:", action.payload);

            state.token = action.payload.token;
            state.role = action.payload.role;
            state.userEmail = action.payload.userEmail;
            state.userName = action.payload.userName;
        },
        logout(state) {
            state.token = null;
            state.role = null;
            state.userName = null;
            state.userID = null;
            state.userEmail = null;
            
            state.logoutSuccess = true;
            
            // Clear local storage here
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userID');
        },
        resetLogoutSuccess(state) {
            state.logoutSuccess = false;
        },
        syncAuthState(state){
            state.token = localStorage.getItem('token');
            state.role = localStorage.getItem('role');
            state.userEmail = localStorage.getItem('userEmail');
            state.userName = localStorage.getItem('userName');
            state.userID = localStorage.getItem('userID');
        }
    },
});

export const selectUserRole = (state) => state.auth.role;
export const selectUserEmail = (state) => state.auth.userEmail;
export const selectUserName = (state) => state.auth.userName;
export const selectUserID = (state) => state.auth.userID;

export const { loginSuccess, logout, resetLogoutSuccess, syncAuthState } = authSlice.actions;
export default authSlice.reducer;
