import { Toast, ToastContainer } from 'react-bootstrap';

const NotificationToast = ({ show, message, variant, onClose }) => {
    const icons = {
        success: '✅',
        danger: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    return (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
            <Toast
                show={show}
                onClose={onClose}
                delay={3500}
                autohide
                bg={variant}
            >
                <Toast.Header closeButton>
                    <strong className="me-auto">
                        {icons[variant] || '📢'} {variant === 'success' ? 'Éxito' : variant === 'danger' ? 'Error' : 'Aviso'}
                    </strong>
                </Toast.Header>
                <Toast.Body className={variant === 'success' || variant === 'danger' ? 'text-white' : ''}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default NotificationToast;
