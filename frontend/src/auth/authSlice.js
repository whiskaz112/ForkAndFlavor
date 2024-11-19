import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const checkAuthCookie = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/checkAuth', { withCredentials: true });
        console.log("Authenticated: ", response.data.authenticated);
        return response.data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: checkAuthCookie(),
        user: null, 
    },
    reducers: {
        loginSuccess: (state) => {
            state.isAuthenticated = true;
            console.log("check login ", state.isAuthenticated)
        },
        logout: (state) => {
            state.isAuthenticated = false;
            console.log("check logout ", state.isAuthenticated)
        },
        validateAuth: (state) => {
            state.isAuthenticated = checkAuthCookie();
            console.log('Auth validated, isAuthenticated:', state.isAuthenticated);
        },
    },
});

export const { loginSuccess, logout, validateAuth } = authSlice.actions;
export default authSlice.reducer;
