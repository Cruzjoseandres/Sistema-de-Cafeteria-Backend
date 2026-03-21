import { Toast, ToastContainer } from 'react-bootstrap';

const NotificationToast = ({ show, message, variant, onClose }) => {
    const icons = {
        success: '✅',
        danger: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    return (
        <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 999999, top: '10px', right: '10px' }}>
            <Toast
                show={show}
                onClose={onClose}
                delay={4000}
                autohide
                className="shadow-lg border-0"
            >
                <Toast.Header closeButton>
                    <strong className="me-auto text-dark" style={{ fontSize: '1.1rem' }}>
                        {icons[variant] || '📢'} {variant === 'success' ? 'Éxito' : variant === 'danger' ? 'Error' : 'Aviso'}
                    </strong>
                </Toast.Header>
                <Toast.Body 
                    className="fw-bold" 
                    style={{ 
                        fontSize: '1.1rem',
                        color: variant === 'success' || variant === 'danger' ? '#ffffff' : '#000000',
                        backgroundColor: variant === 'success' ? '#198754' : variant === 'danger' ? '#dc3545' : '#f8f9fa'
                    }}
                >
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default NotificationToast;
