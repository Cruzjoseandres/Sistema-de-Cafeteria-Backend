import { useState } from 'react';

/**
 * Hook para manejar notificaciones Toast y modal de confirmación
 * Reemplaza alert() y window.confirm() con UI más agradable
 */
export const useNotification = () => {
    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    // Confirm modal state
    const [confirm, setConfirm] = useState({ show: false, message: '', onConfirm: null, confirmText: 'Sí, eliminar', confirmVariant: 'danger' });

    const showSuccess = (message) => {
        setToast({ show: true, message, variant: 'success' });
    };

    const showError = (errOrMessage, fallbackMessage = 'Ocurrió un error inesperado al procesar la operación') => {
        let message = fallbackMessage;
        if (typeof errOrMessage === 'string') {
            message = errOrMessage;
        } else if (errOrMessage && typeof errOrMessage === 'object') {
            if (errOrMessage.userMessage) {
                message = errOrMessage.userMessage;
            } else if (errOrMessage.response?.data?.message) {
                const dataMsg = errOrMessage.response.data.message;
                message = Array.isArray(dataMsg) ? `Por favor corrige lo siguiente:\n• ${dataMsg.join('\n• ')}` : dataMsg;
            } else if (errOrMessage.message) {
                message = (errOrMessage.message === 'Network Error' || errOrMessage.code === 'ERR_NETWORK')
                    ? 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                    : errOrMessage.message;
            }
        }
        setToast({ show: true, message: String(message), variant: 'danger' });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const showConfirm = (message, options = {}) => {
        const { confirmText = 'Sí, eliminar', confirmVariant = 'danger' } = options;
        return new Promise((resolve) => {
            setConfirm({
                show: true,
                message,
                confirmText,
                confirmVariant,
                onConfirm: (result) => {
                    setConfirm({ show: false, message: '', confirmText: 'Sí, eliminar', confirmVariant: 'danger', onConfirm: null });
                    resolve(result);
                }
            });
        });
    };

    return {
        toast,
        confirm,
        showSuccess,
        showError,
        hideToast,
        showConfirm,
    };
};
