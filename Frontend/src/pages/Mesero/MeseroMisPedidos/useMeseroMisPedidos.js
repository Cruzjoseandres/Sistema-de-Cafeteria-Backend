import { useState, useEffect } from 'react';
import { getMisPedidos } from '../../../../services/PedidoService';
import { useNavigate } from 'react-router-dom';

export const useMeseroMisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Todos'); // Todos, Activos, Completados
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchMisPedidos = async () => {
        try {
            setLoading(true);
            const data = await getMisPedidos();
            setPedidos(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener tus pedidos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMisPedidos();
    }, []);

    const handleViewPedido = (idPedido) => {
        navigate(`/mesero/pedido/${idPedido}`, { state: { from: '/mesero/mis-pedidos' } });
    };

    const filteredPedidos = pedidos.filter(pedido => {
        // Filtro por Búsqueda (ID o Mesa)
        const matchesSearch = 
            pedido.id.toString().includes(searchTerm) || 
            pedido.mesa?.numero.toString().includes(searchTerm);
        
        // Filtro por Estado
        // 3 = Completado / Inactivo en algunos contextos de la UI
        const isCompletado = pedido.estado?.id === 3 || pedido.estado?.nombre === 'INACTIVO' || pedido.estado?.nombre === 'COMPLETADO' || pedido.estado?.nombre === 'PAGADO';
        
        let matchesStatus = true;
        if (filterStatus === 'Activos') matchesStatus = !isCompletado;
        if (filterStatus === 'Completados') matchesStatus = isCompletado;

        return matchesSearch && matchesStatus;
    });

    return {
        pedidos: filteredPedidos, // Retornamos los filtrados para que la UI los use directamente
        allPedidos: pedidos,
        loading,
        error,
        filterStatus,
        setFilterStatus,
        searchTerm,
        setSearchTerm,
        handleViewPedido,
        fetchMisPedidos
    };
};
