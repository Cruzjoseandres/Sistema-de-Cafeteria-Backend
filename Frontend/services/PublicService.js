
import apiClient from "./apiClient";

const getMenuPublico = async () => {
    try {
        const response = await apiClient.get(`/public/menu`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getCategoriasPublicas = async () => {
    try {
        const response = await apiClient.get(`/public/categorias`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { getMenuPublico, getCategoriasPublicas };
