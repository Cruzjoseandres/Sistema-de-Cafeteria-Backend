import React from 'react';
import { Container, Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAdminMesas } from './useAdminMesas';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import PaginationBar from '../../../components/PaginationBar';

const AdminMesas = () => {
    const {
        mesas, loading, error, showModal, modalType, formData,
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

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nº Mesa</th>
                        <th>Capacidad</th>
                        <th>Estado</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagination.paginatedData.map((mesa) => (
                        <tr key={mesa.id}>
                            <td>{mesa.id}</td>
                            <td><strong>Mesa {mesa.numero}</strong></td>
                            <td>{mesa.capacidad} personas</td>
                            <td>
                                <Badge bg={mesa.estado?.nombre === 'DISPONIBLE' ? 'success' : mesa.estado?.nombre === 'OCUPADA' ? 'danger' : 'secondary'}>
                                    {mesa.estado?.nombre || 'Sin estado'}
                                </Badge>
                                {mesa.es_juntada && (
                                    <Badge bg="info" className="ms-2">
                                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'text-bottom' }}>groups</span> Juntada
                                    </Badge>
                                )}
                            </td>
                            <td>{mesa.descripcion || '-'}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="warning" size="sm" onClick={() => handleOpenModal('editar', mesa)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(mesa.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {pagination.totalItems === 0 && (
                        <tr><td colSpan="6" className="text-center text-muted">No hay mesas registradas.</td></tr>
                    )}
                </tbody>
            </Table>
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
                        <Button variant="primary" type="submit">
                            {modalType === 'editar' ? 'Guardar Cambios' : 'Crear Mesa'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminMesas;
