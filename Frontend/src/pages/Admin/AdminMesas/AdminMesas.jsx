import React from 'react';
import { Container, Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
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
        <Container className="mt-4">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gestión de Mesas</h1>
                <Button variant="primary" onClick={() => handleOpenModal('crear')}>
                    + Crear Mesa
                </Button>
            </div>

            <div className="admin-card border-0 shadow-sm p-0 overflow-hidden">
                <Table hover responsive className="custom-table m-0 align-middle">
                    <thead className="bg-light text-nowrap">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="py-3">Nº Mesa</th>
                            <th className="py-3">Capacidad</th>
                            <th className="py-3">Estado</th>
                            <th className="py-3">Descripción</th>
                            <th className="text-end px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagination.paginatedData.map((mesa) => (
                            <tr key={mesa.id}>
                                <td className="px-4 py-3 text-nowrap fw-bold">#{mesa.id}</td>
                                <td className="py-3 text-nowrap"><strong className="fs-6">Mesa {mesa.numero}</strong></td>
                                <td className="py-3 text-nowrap">{mesa.capacidad} personas</td>
                                <td className="py-3 text-nowrap">
                                    <Badge bg={mesa.estado?.nombre === 'DISPONIBLE' ? 'success' : mesa.estado?.nombre === 'OCUPADA' ? 'danger' : 'secondary'} className="px-3 py-2">
                                        {mesa.estado?.nombre || 'Sin estado'}
                                    </Badge>
                                    {mesa.es_juntada && (
                                        <Badge bg="info" className="ms-2 px-2 py-2">
                                            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'text-bottom' }}>groups</span> Juntada
                                        </Badge>
                                    )}
                                </td>
                                <td className="py-3" style={{ minWidth: '160px' }}>{mesa.descripcion || '-'}</td>
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'editar' ? 'Editar Mesa' : 'Crear Mesa'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Número de Mesa *</Form.Label>
                            <Form.Control type="number" name="numero" value={formData.numero} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacidad (personas) *</Form.Label>
                            <Form.Control type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="switch"
                                id="es_juntada-switch"
                                name="es_juntada"
                                label={<>Mesa Juntada <small className="text-muted d-block" style={{marginTop: '-2px'}}>(Soporta múltiples pedidos simultáneos de diferentes grupos)</small></>}
                                checked={formData.es_juntada}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : (modalType === 'editar' ? 'Guardar Cambios' : 'Crear Mesa')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminMesas;
