import React from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAdminCategorias } from './useAdminCategorias';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import PaginationBar from '../../../components/PaginationBar';

const AdminCategorias = () => {
    const {
        categorias, loading, error, showModal, modalType, formData, validated,
        handleOpenModal, handleCloseModal, handleChange, handleSubmit, handleDelete,
        toast, confirm, hideToast, pagination
    } = useAdminCategorias();

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
        <Container fluid className="px-0">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="admin-title-lg">Gestión de Categorías</h1>
                    <p className="admin-subtitle m-0">Organiza la estructura del menú de tu cafetería.</p>
                </div>
                <div className="d-flex gap-2">
                    {/* El botón de crear no es necesario porque el form está a la izquierda, 
                        pero lo tenemos por si el usuario quiere limpiar el form (como "Nuevo") */}
                    <button className="btn-admin-primary" onClick={() => handleCloseModal()}>
                        + Nueva Categoría
                    </button>
                </div>
            </div>

            {/* Simulated Widgets Row */}
            <Row className="mb-4">
                <Col md={4}>
                    <div className="admin-card d-flex align-items-center gap-3 py-3">
                        <span className="material-symbols-outlined" style={{ color: 'var(--admin-accent)', fontSize: '2rem' }}>folder_open</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Total Categorías</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{categorias.length}</div>
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="admin-card d-flex align-items-center gap-3 py-3">
                        <span className="material-symbols-outlined" style={{ color: '#4dabf7', fontSize: '2rem' }}>inventory_2</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Promedio / Cat</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>--</div>
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="admin-card d-flex align-items-center gap-3 py-3">
                        <span className="material-symbols-outlined" style={{ color: 'var(--admin-green)', fontSize: '2rem' }}>trending_up</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Categoría Top</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                                {categorias.length > 0 ? categorias[0].nombre : '-'}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="gx-4">
                {/* Left Panel: Static Form for CREATE */}
                <Col md={4}>
                    <div className="admin-card">
                        <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Añadir Nueva Categoría</h3>
                        {/* If we are editing, we redirect the user to finish editing in the modal. But the hook submits using modalType correctly. */}
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="admin-form-group">
                                <Form.Label className="admin-form-label">Nombre de Categoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={!showModal ? formData.nombre : ''} // Solo mostrar si NO estamos en modal
                                    onChange={handleChange}
                                    className="admin-form-control"
                                    placeholder="e.g., Especiales de Temporada"
                                    required
                                    disabled={showModal}
                                />
                                <Form.Control.Feedback type="invalid">El nombre de la categoría es obligatorio.</Form.Control.Feedback>
                            </Form.Group>

                            {/* Dummy fields for UI mimicking the prompt, won't be sent since left out of formData */}
                            <Form.Group className="admin-form-group">
                                <Form.Label className="admin-form-label">Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    className="admin-form-control"
                                    placeholder="Breve descripción..."
                                    disabled={showModal}
                                />
                            </Form.Group>
                            <Form.Group className="admin-form-group mb-4">
                                <Form.Label className="admin-form-label">Estado</Form.Label>
                                <div style={{ paddingTop: '0.5rem' }}>
                                    <Form.Check
                                        type="switch"
                                        id="estado-categoria-switch"
                                        label="Activa (Visible)"
                                        defaultChecked={true}
                                        disabled={showModal}
                                    />
                                </div>
                            </Form.Group>

                            <button type="submit" className="btn-admin-primary w-100" disabled={showModal}>
                                Crear Categoría
                            </button>
                        </Form>
                    </div>
                </Col>

                {/* Right Panel: Table */}
                <Col md={8}>
                    <div className="admin-card p-0" style={{ overflow: 'hidden' }}>
                        <Table hover responsive className="custom-table m-0 align-middle">
                            <thead>
                                <tr>
                                    <th>NOMBRE CATEGORÍA</th>
                                    <th>FECHA CREACIÓN</th>
                                    <th className="text-end">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagination.paginatedData.map((cat) => (
                                    <tr key={cat.id}>
                                        <td style={{ verticalAlign: 'middle', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                                            <span className="material-symbols-outlined align-middle" style={{ marginRight: '8px', color: 'var(--admin-accent)', fontSize: '1.2rem' }}>local_cafe</span>
                                            {cat.nombre}
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>{new Date(cat.created_at).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn-admin-secondary d-flex align-items-center gap-1" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }} onClick={() => handleOpenModal('editar', cat)}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit_square</span> Editar
                                                </button>
                                                <button className="btn-admin-secondary d-flex align-items-center gap-1" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--neon-danger)', borderColor: 'rgba(220,53,69,0.2)' }} onClick={() => handleDelete(cat.id)}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pagination.totalItems === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">No hay categorías registradas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <PaginationBar {...pagination} />
                </Col>
            </Row>

            {/* Edit Modal matching Dark Theme */}
            <Modal show={showModal} onHide={handleCloseModal} contentClassName="admin-card" backdropClassName="admin-modal-backdrop">
                <Modal.Header closeButton style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-panel-bg)' }}>
                    <Modal.Title className="admin-title-lg" style={{ fontSize: '1.25rem' }}>Editar Categoría</Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
                    <Modal.Body style={{ background: 'var(--admin-panel-bg)' }}>
                        <Form.Group className="admin-form-group mb-4">
                            <Form.Label className="admin-form-label">Nombre *</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="admin-form-control"
                                required
                            />
                            <Form.Control.Feedback type="invalid">El nombre de la categoría es obligatorio.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="admin-form-group">
                            <Form.Label className="admin-form-label">Estado</Form.Label>
                            <div style={{ paddingTop: '0.5rem' }}>
                                <Form.Check
                                    type="switch"
                                    id="estado-categoria-edit-switch"
                                    label="Activa (Visible)"
                                    defaultChecked={true}
                                />
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: '1px solid var(--admin-border)', background: 'var(--admin-panel-bg)' }}>
                        <button type="button" className="btn-admin-secondary" onClick={handleCloseModal}>Cancelar</button>
                        <button type="submit" className="btn-admin-primary">
                            Guardar Cambios
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminCategorias;
