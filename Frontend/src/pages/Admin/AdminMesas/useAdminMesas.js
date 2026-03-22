import { useState, useEffect, useCallback } from 'react';
import { getAllMesas, createMesa, updateMesa, deleteMesa } from '../../../../services/MesaService';
import { useNotification } from '../../../../hooks/useNotification';
import { usePagination } from '../../../../hooks/usePagination';

export const useAdminMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('crear');
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        numero: '',
        capacidad: '',
        descripcion: '',
        es_juntada: false,
    });

    const { toast, confirm, showSuccess, showError, hideToast, showConfirm } = useNotification();

    const loadMesas = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllMesas();
            setMesas(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar mesas:', err);
            setError('Error al cargar las mesas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMesas();
    }, [loadMesas]);

    const pagination = usePagination(mesas, 10);

    const handleOpenModal = (type, item = null) => {
        setModalType(type);
        if (item) {
            setSelectedItem(item);
            setFormData({
                numero: item.numero,
                capacidad: item.capacidad,
                descripcion: item.descripcion || '',
                es_juntada: item.es_juntada || false,
            });
        } else {
            setSelectedItem(null);
            setFormData({ numero: '', capacidad: '', descripcion: '', es_juntada: false });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                numero: parseInt(formData.numero),
                capacidad: parseInt(formData.capacidad),
                descripcion: formData.descripcion,
                es_juntada: formData.es_juntada,
            };

            if (modalType === 'editar') {
                await updateMesa(selectedItem.id, payload);
                showSuccess('Mesa actualizada exitosamente');
            } else {
                await createMesa(payload);
                showSuccess('Mesa creada exitosamente');
            }
            handleCloseModal();
            loadMesas();
        } catch (err) {
            console.error('Error:', err);
            showError(err.response?.data?.message || 'Error al guardar la mesa');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showConfirm('¿Estás seguro de eliminar esta mesa?');
        if (confirmed) {
            try {
                await deleteMesa(id);
                showSuccess('Mesa eliminada exitosamente');
                loadMesas();
            } catch (err) {
                console.error('Error al eliminar:', err);
                showError('Error al eliminar la mesa');
            }
        }
    };

    return {
        mesas, loading, error, showModal, modalType, formData,
        handleOpenModal, handleCloseModal, handleChange, handleSubmit, handleDelete,
        toast, confirm, hideToast, pagination
    };
};
