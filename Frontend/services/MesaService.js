

import apiClient from "./apiClient";
import { getAccessToken } from "../utils/TokenUtilities";

const getAuthHeaders = () => {
    const token = getAccessToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

const getAllMesas = async () => {
    try {
        const response = await apiClient.get(`/mesa`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getMesaById = async (id) => {
    try {
        const response = await apiClient.get(`/mesa/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createMesa = async (data) => {
    try {
        const response = await apiClient.post(`/mesa`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateMesa = async (id, data) => {
    try {
        const response = await apiClient.patch(`/mesa/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteMesa = async (id) => {
    try {
        const response = await apiClient.delete(`/mesa/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { getAllMesas, getMesaById, createMesa, updateMesa, deleteMesa };
