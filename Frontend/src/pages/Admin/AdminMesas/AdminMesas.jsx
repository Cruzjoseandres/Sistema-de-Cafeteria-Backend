import React from 'react';
import { Container, Table, Button, Modal, Form, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAdminMesas } from './useAdminMesas';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import PaginationBar from '../../../components/PaginationBar';

const AdminMesas = () => {
    const {
        mesas, loading, error, showModal, modalType, formData, isSubmitting,
        handleOpenModal, handleCloseModal, handleChange, handleSubmit, handleDelete,
        toast, confirm, hideToast, pagination
    } = useAdminMesas();

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="px-0">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} />

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h1 className="admin-title-lg">Gestión de Mesas</h1>
                    <p className="admin-subtitle m-0">Administra la distribución y capacidad del salón.</p>
                </div>
                <button className="btn-admin-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => handleOpenModal('crear')}>
                    <span className="material-symbols-outlined fs-5">add_circle</span>
                    <span>Nueva Mesa</span>
                </button>
            </div>

            <div className="admin-card border-0 shadow-sm p-0 overflow-hidden">
                <Table hover responsive className="custom-table m-0 align-middle">
                    <thead className="bg-light text-nowrap">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="py-3">Nº MESA</th>
                            <th className="py-3">CAPACIDAD</th>
                            <th className="py-3">ESTADO</th>
                            <th className="py-3">DESCRIPCIÓN</th>
                            <th className="text-end px-4 py-3">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagination.paginatedData.map((mesa) => (
                            <tr key={mesa.id}>
                                <td className="px-4 py-3 text-nowrap fw-bold text-muted">#{mesa.id}</td>
                                <td className="py-3 text-nowrap">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">table_restaurant</span>
                                        <strong className="fs-6 text-dark">Mesa {mesa.numero}</strong>
                                    </div>
                                </td>
                                <td className="py-3 text-nowrap">{mesa.capacidad} personas</td>
                                <td className="py-3 text-nowrap">
                                    <span className={`admin-badge ${mesa.estado?.nombre === 'DISPONIBLE' ? 'success' : mesa.estado?.nombre === 'OCUPADA' ? 'danger' : 'warning'}`}>
                                        {mesa.estado?.nombre || 'Sin estado'}
                                    </span>
                                    {mesa.es_juntada && (
                                        <span className="admin-badge primary ms-2 d-inline-flex align-items-center gap-1">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>groups</span> Juntada
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 text-muted" style={{ minWidth: '160px' }}>{mesa.descripcion || '-'}</td>
                                <td className="text-end px-4 py-3 text-nowrap">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn-admin-secondary d-flex align-items-center gap-1"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }}
                                            onClick={() => handleOpenModal('editar', mesa)}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit_square</span> Editar
                                        </button>
                                        <button
                                            className="btn-admin-secondary d-flex align-items-center gap-1"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--neon-danger)', borderColor: 'rgba(220,53,69,0.2)' }}
                                            onClick={() => handleDelete(mesa.id)}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pagination.totalItems === 0 && (
                            <tr><td colSpan="6" className="text-center py-5 text-muted">No hay mesas registradas.</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <PaginationBar {...pagination} />

            <Modal show={showModal} onHide={handleCloseModal} contentClassName="admin-card border-0 shadow-lg" backdropClassName="admin-modal-backdrop" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(180,66,10,0.12)', background: 'var(--admin-panel-bg)', padding: '1.25rem 1.5rem' }}>
                    <Modal.Title className="admin-title-lg d-flex align-items-center gap-2 m-0" style={{ fontSize: '1.2rem' }}>
                        <span className="material-symbols-outlined text-primary">{modalType === 'crear' ? 'add_circle' : 'edit_square'}</span>
                        <span>{modalType === 'editar' ? 'Editar Mesa' : 'Nueva Mesa'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body style={{ background: 'var(--admin-panel-bg)', padding: '1.5rem' }}>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Group className="admin-form-group mb-0">
                                    <Form.Label className="admin-form-label">Número de Mesa *</Form.Label>
                                    <Form.Control type="number" name="numero" value={formData.numero} onChange={handleChange} className="admin-form-control" placeholder="Ej. 5" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="admin-form-group mb-0">
                                    <Form.Label className="admin-form-label">Capacidad (personas) *</Form.Label>
                                    <Form.Control type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} className="admin-form-control" placeholder="Ej. 4" required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="admin-form-group mb-3">
                            <Form.Label className="admin-form-label">Descripción</Form.Label>
                            <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleChange} className="admin-form-control" placeholder="Ej. Terraza interior junto a la ventana" />
                        </Form.Group>
                        <Form.Group className="admin-form-group mb-0 p-3 rounded bg-light border">
                            <Form.Check 
                                type="switch"
                                id="es_juntada-switch"
                                name="es_juntada"
                                label={<span className="fw-semibold text-dark">Mesa Juntada / Múltiples Pedidos <small className="text-muted d-block fw-normal mt-1">Soporta múltiples pedidos simultáneos de diferentes grupos</small></span>}
                                checked={formData.es_juntada}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: '1px solid rgba(180,66,10,0.12)', background: 'var(--admin-panel-bg)', padding: '1rem 1.5rem' }}>
                        <button type="button" className="btn-admin-secondary px-4" onClick={handleCloseModal}>Cancelar</button>
                        <button type="submit" className="btn-admin-primary px-4 d-flex align-items-center gap-2" disabled={isSubmitting}>
                            <span className="material-symbols-outlined fs-6">save</span>
                            <span>{isSubmitting ? 'Guardando...' : (modalType === 'editar' ? 'Guardar Cambios' : 'Crear Mesa')}</span>
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminMesas;
