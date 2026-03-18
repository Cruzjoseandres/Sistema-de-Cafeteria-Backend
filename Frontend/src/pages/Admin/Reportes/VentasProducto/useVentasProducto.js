import { useState, useEffect } from 'react';
import { getVentasProducto } from '../../../../../services/ReporteService';

export const useVentasProducto = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getVentasProducto();
                setData(result);
            } catch (err) {
                setError('Error al obtener ventas por producto');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
};
