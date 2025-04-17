// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update as needed

export const register = (data) => axios.post(`${API_URL}/register/`, data);

export const login = (data) => axios.post(`${API_URL}/login/`, data);
// src/api/auth.js
export const forgotPassword = (data) => axios.post(`${API_URL}/forgot-password/`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/reset-password/`, data);


export const getProfile = (token) =>
  axios.get(`${API_URL}/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
