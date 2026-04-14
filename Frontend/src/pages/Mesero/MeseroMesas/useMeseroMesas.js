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
        return saved !== null ? JSON.parse(saved) : true;
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

    // Buscador
    const [filtroBusqueda, setFiltroBusqueda] = useState('');

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

    const pedidosActivosFiltrados = pedidosActivos.filter(p => {
        if (filtroMisPedidos && p.usuario?.id !== currentUser?.id) return false;
        
        if (filtroBusqueda.trim() !== '') {
            const query = filtroBusqueda.toLowerCase();
            const esMesa = p.mesa?.numero?.toString().includes(query) || (p.mesa?.es_juntada && 'juntada'.includes(query));
            const esPedido = p.id?.toString().includes(query);
            // Search multiple accounts if they exist
            const coincidenciaCuenta = p.cuentas?.some(c => c.nombre_cliente?.toLowerCase().includes(query));
            
            if (!esMesa && !esPedido && !coincidenciaCuenta) {
                return false;
            }
        }
        return true;
    });

    return {
        mesas, pedidosActivos, pedidosActivosFiltrados, loading, error,
        showCrearPedidoModal, setShowCrearPedidoModal,
        mesaSeleccionada, setMesaSeleccionada, mesasDisponibles,
        filtroMisPedidos, setFiltroMisPedidos: setFiltroMisPedidosPersistent,
        filtroBusqueda, setFiltroBusqueda,
        handleCrearPedido, handleAbrirPedido
    };
};
