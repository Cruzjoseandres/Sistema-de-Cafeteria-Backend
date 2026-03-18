import { useState, useEffect } from 'react';
import { getVentasGenerales } from '../../../../../services/ReporteService';

export const useVentasGenerales = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getVentasGenerales();
                setData(result);
            } catch (err) {
                setError('Error al obtener ventas generales');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalIngresos = data.reduce((sum, item) => sum + item.total_ventas, 0);

    return { data, loading, error, totalIngresos };
};
