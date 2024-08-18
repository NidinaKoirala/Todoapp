import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Set the backend URL here
});

export default axiosInstance;
