import axios from 'axios';
import { getAccessToken, removeAccessToken } from '../utils/TokenUtilities';
import { API_URL } from './config';

const apiClient = axios.create({
    baseURL: API_URL
});

// Request interceptor to attach the token
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to catch 401s globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.error("Session expired or unauthorized. Logging out...");
            removeAccessToken();
            // Force a reload to route the user to /login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
