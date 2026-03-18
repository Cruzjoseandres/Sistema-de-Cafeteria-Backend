import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMesas } from '../../../../services/MesaService';
import { createPedido, getAllPedidos } from '../../../../services/PedidoService';
import { useNotification } from '../../../../hooks/useNotification';
import { getUserInfo } from '../../../../utils/TokenUtilities';

export const useMeseroMesas = () => {
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [pedidosActivos, setPedidosActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modales
    const [showCrearPedidoModal, setShowCrearPedidoModal] = useState(false);
    const [mesaSeleccionada, setMesaSeleccionada] = useState('');
    const [filtroMisPedidos, setFiltroMisPedidos] = useState(() => {
        const saved = localStorage.getItem('filtroMisPedidos');
        return saved ? JSON.parse(saved) : false;
    });

    const { showSuccess, showError } = useNotification();
    const currentUser = getUserInfo();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [mesasData, pedidosData] = await Promise.all([
                getAllMesas(),
                getAllPedidos()
            ]);
            setMesas(mesasData);
            setPedidosActivos(pedidosData.filter(p => p.estado?.nombre === 'ACTIVO'));
            setError(null);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCrearPedido = async () => {
        if (!mesaSeleccionada) return;
        try {
            const userInfo = getUserInfo();
            const pedido = await createPedido({
                id_mesa: parseInt(mesaSeleccionada),
                id_usuario: userInfo.id,
            });
            setShowCrearPedidoModal(false);
            setMesaSeleccionada('');
            showSuccess(`Pedido #${pedido.id} abierto en Mesa ${pedido.mesa?.numero}`);
            navigate(`/mesero/pedido/${pedido.id}`);
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || 'Error al crear el pedido');
        }
    };

    const setFiltroMisPedidosPersistent = (value) => {
        setFiltroMisPedidos(value);
        localStorage.setItem('filtroMisPedidos', JSON.stringify(value));
    };

    const handleAbrirPedido = (pedido, mode = 'edit') => {
        navigate(`/mesero/pedido/${pedido.id}?mode=${mode}`);
    };

    const mesasDisponibles = mesas.filter(m => {
        if (m.es_juntada) return true;
        return !pedidosActivos.some(p => p.mesa?.id === m.id);
    });

    const pedidosActivosFiltrados = filtroMisPedidos 
        ? pedidosActivos.filter(p => p.usuario?.id === currentUser?.id)
        : pedidosActivos;

    return {
        mesas, pedidosActivos, pedidosActivosFiltrados, loading, error,
        showCrearPedidoModal, setShowCrearPedidoModal,
        mesaSeleccionada, setMesaSeleccionada, mesasDisponibles,
        filtroMisPedidos, setFiltroMisPedidos: setFiltroMisPedidosPersistent,
        handleCrearPedido, handleAbrirPedido
    };
};
