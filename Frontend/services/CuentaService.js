

import apiClient from "./apiClient";
import { API_URL } from "./config";
import { getAccessToken } from "../utils/TokenUtilities";

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getAccessToken()}` }
});

const createCuenta = async (data) => {
    try {
        const response = await apiClient.post(`/cuenta`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCuentasByPedido = async (idPedido) => {
    try {
        const response = await apiClient.get(`/cuenta/pedido/${idPedido}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCuentaById = async (id) => {
    try {
        const response = await apiClient.get(`/cuenta/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateCuenta = async (id, data) => {
    try {
        const response = await apiClient.patch(`/cuenta/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteCuenta = async (id) => {
    try {
        const response = await apiClient.delete(`/cuenta/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const uploadQR = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/cuenta/qr`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getAccessToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getQRUrl = () => {
    return `${API_URL}/cuenta/qr?t=${new Date().getTime()}`;
};

export { createCuenta, getCuentasByPedido, getCuentaById, updateCuenta, deleteCuenta, uploadQR, getQRUrl };
