import React, { useState } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Badge, Table, Modal, Button } from 'react-bootstrap';
import { useAdminUsuarios } from './useAdminUsuarios';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        usuarios,
        roles,
        loading,
        error,
        showModal,
        modalType,
        formData,
        selectedUser,
        handleOpenModal,
        handleCloseModal,
        handleChange,
        handleSubmit,
        handleDelete,
        getRoleBadge,
        toast,
        confirm,
        hideToast,
        validated
    } = useAdminUsuarios();

    if (loading) {
        return (
            <Container className="mt-5 text-center px-0">
                <Spinner animation="border" role="status" style={{ color: 'var(--admin-accent)' }}>
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 px-0">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="px-0 admin-usuarios-container">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} />

            <Row className="h-100 gx-0 rounded-4 overflow-hidden" style={{ border: '1px solid var(--glass-border-light)', background: 'var(--glass-bg)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(10px)' }}>
                {/* Left Panel: Team Members List */}
                <Col md={3} className="d-flex flex-column" style={{ borderRight: '1px solid var(--glass-border-light)', background: 'rgba(255, 255, 255, 0.5)', maxHeight: '85vh', overflowY: 'auto' }}>
                    <div className="p-4" style={{ borderBottom: '1px solid var(--glass-border-light)' }}>
                        <h2 className="admin-title-lg mb-1" style={{ fontSize: '1.2rem' }}>Miembros del Equipo</h2>
                        <p className="admin-subtitle mb-3" style={{ fontSize: '0.8rem' }}>Gestionar permisos y roles</p>

                        <div className="admin-search w-100" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--glass-border-light)' }}>
                            <span role="img" aria-label="search" style={{ fontSize: '0.9rem' }}>🔍</span>
                            <input type="text" placeholder="Buscar personal..." style={{ fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    <div className="flex-grow-1 p-2">
                        {usuarios.map((usuario) => (
                            <div key={usuario.id} className="d-flex align-items-center justify-content-between p-3 rounded mb-1" style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: formData?.id === usuario.id || selectedUser?.id === usuario.id ? 'var(--admin-panel-hover)' : 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-panel-hover)'} onMouseLeave={(e) => { if (formData?.id !== usuario.id) { e.currentTarget.style.backgroundColor = 'transparent' } }} onClick={() => handleOpenModal('editar', usuario)}>
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--admin-panel-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--admin-accent)' }}>
                                        {usuario.persona?.nombre?.charAt(0) || usuario.username.charAt(0).toUpperCase()}
                                        {usuario.persona?.apellido?.charAt(0) || ''}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--admin-text-main)' }}>
                                            {usuario.persona?.nombre || usuario.username} {usuario.persona?.apellido || ''}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{usuario.rol?.nombre}</div>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--admin-text-muted)' }}>›</div>
                            </div>
                        ))}
                    </div>

                </Col>

                {/* Right Panel: Register New Staff */}
                <Col md={9} className="p-0" style={{ background: 'transparent', maxHeight: '85vh', overflowY: 'auto' }}>
                    <div className="p-5">
                        <div className="mb-5">
                            <Badge bg="warning" className="mb-2 text-dark px-2" style={{ opacity: 0.8 }}>{modalType === 'crear' ? 'NUEVO' : 'EDITAR'}</Badge> <span className="text-muted" style={{ fontSize: '0.8rem' }}> / {modalType === 'crear' ? 'Gestión de Usuarios' : 'Edición de Usuarios'}</span>
                            <h1 className="admin-title-lg m-0" style={{ fontSize: '2rem' }}>
                                {modalType === 'crear' ? 'Registrar Nuevo Personal' : 'Editar Miembro de Personal'}
                            </h1>
                            <p className="admin-subtitle mt-2" style={{ fontSize: '0.95rem' }}>
                                {modalType === 'crear'
                                    ? 'Crea una nueva cuenta para miembros del personal. Asigna roles y configura las credenciales de seguridad iniciales. Todos los campos marcados con * son obligatorios.'
                                    : 'Modifica los detalles de la cuenta, roles o actualiza la contraseña si es necesario.'}
                            </p>
                        </div>

                        <Form noValidate validated={validated} onSubmit={handleSubmit} className="admin-card mb-4" style={{ padding: '2rem' }}>
                            {/* Personal Information */}
                            <div className="mb-4">
                                <h4 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--admin-accent)' }}>🪪</span> Información Personal
                                </h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Nombre *</Form.Label>
                                            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="admin-form-control" placeholder="Ej. Ana" required />
                                            <Form.Control.Feedback type="invalid">El nombre es obligatorio.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Apellido *</Form.Label>
                                            <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="admin-form-control" placeholder="Ej. García" required />
                                            <Form.Control.Feedback type="invalid">El apellido es obligatorio.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Correo Electrónico</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} className="admin-form-control" placeholder="ana@cafe.com" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Teléfono</Form.Label>
                                            <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="admin-form-control" placeholder="+12345678" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Role & Security */}
                            <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--glass-border-light)' }}>
                                <h4 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
                                    <span style={{ color: 'var(--admin-accent)' }}>🛡️</span> Rol y Seguridad
                                </h4>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Asignación de Rol *</Form.Label>
                                            <Form.Select name="id_rol" value={formData.id_rol} onChange={handleChange} className="admin-form-control" required>
                                                <option value="">Selecciona un rol...</option>
                                                {roles.map((rol) => (
                                                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">Debe seleccionar un rol válido.</Form.Control.Feedback>
                                            <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>Controla el nivel de acceso en el sistema.</small>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Nombre de Usuario *</Form.Label>
                                            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} className="admin-form-control" placeholder="anagarcia" required />
                                            <Form.Control.Feedback type="invalid">El nombre de usuario es requerido.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">{modalType === 'editar' ? 'Nueva Contraseña (Opc.)' : 'Contraseña Inicial *'}</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="admin-form-control" placeholder="••••••••" required={modalType === 'crear'} style={{ paddingRight: '40px' }} />
                                                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowPassword(!showPassword)}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                                                </span>
                                            </div>
                                            <Form.Control.Feedback type="invalid">La contraseña inicial es obligatoria.</Form.Control.Feedback>
                                            <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>Debe tener al menos 8 caracteres.</small>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            <div className="d-flex justify-content-between align-items-center pt-4 mt-4" style={{ borderTop: '1px solid var(--glass-border-light)' }}>
                                {modalType === 'editar' && (
                                    <Button variant="danger" className="px-4 border-0 d-flex align-items-center gap-1" style={{ background: 'rgba(220,53,69,0.1)', color: 'var(--admin-red)', borderRadius: '8px' }} onClick={() => {
                                        const u = usuarios.find(u => u.username === formData.username);
                                        if (u) handleDelete(u.id);
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>person_remove</span> Eliminar Personal
                                    </Button>
                                )}
                                <div className="d-flex gap-3 align-items-center ms-auto">
                                    <button type="button" className="btn-admin-secondary d-flex align-items-center gap-1" style={{ borderRadius: '8px' }} onClick={handleCloseModal}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>close</span> Cancelar
                                    </button>
                                    <button type="submit" className="btn-admin-primary px-4 py-2 d-flex align-items-center gap-1" style={{ borderRadius: '8px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                                            {modalType === 'editar' ? 'save' : 'person_add'}
                                        </span>
                                        {modalType === 'editar' ? 'Guardar Cambios' : 'Crear Cuenta'}
                                    </button>
                                </div>
                            </div>
                        </Form>

                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminUsuarios;
