import axios from 'axios';
import qs from 'qs';


import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
 
const http = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { encode: true }),
});
 
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
export default http;
 