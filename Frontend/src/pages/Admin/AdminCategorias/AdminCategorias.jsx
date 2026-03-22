import React from 'react';
import { Container, Table, Form, Spinner, Alert, Modal } from 'react-bootstrap';
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

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h1 className="admin-title-lg">Gestión de Categorías</h1>
                    <p className="admin-subtitle m-0">Organiza la estructura del menú de tu cafetería.</p>
                </div>
                <button className="btn-admin-primary" onClick={() => handleOpenModal('crear')}>
                    + Nueva Categoría
                </button>
            </div>

            {/* Table */}
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
                                <td style={{ verticalAlign: 'middle' }}>
                                    {new Date(cat.created_at).toLocaleDateString()}
                                </td>
                                <td className="text-end">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn-admin-secondary d-flex align-items-center gap-1"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }}
                                            onClick={() => handleOpenModal('editar', cat)}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit_square</span> Editar
                                        </button>
                                        <button
                                            className="btn-admin-secondary d-flex align-items-center gap-1"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--neon-danger)', borderColor: 'rgba(220,53,69,0.2)' }}
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pagination.totalItems === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">
                                    No hay categorías registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <PaginationBar {...pagination} />

            {/* Create / Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} contentClassName="admin-card" backdropClassName="admin-modal-backdrop">
                <Modal.Header closeButton style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-panel-bg)' }}>
                    <Modal.Title className="admin-title-lg" style={{ fontSize: '1.2rem' }}>
                        {modalType === 'crear' ? '+ Nueva Categoría' : 'Editar Categoría'}
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body style={{ background: 'var(--admin-panel-bg)' }}>
                        <Form.Group className="admin-form-group mb-4">
                            <Form.Label className="admin-form-label">Nombre *</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="admin-form-control"
                                placeholder="e.g., Especiales de Temporada"
                                required
                            />
                            <Form.Control.Feedback type="invalid">El nombre de la categoría es obligatorio.</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: '1px solid var(--admin-border)', background: 'var(--admin-panel-bg)' }}>
                        <button type="button" className="btn-admin-secondary" onClick={handleCloseModal}>Cancelar</button>
                        <button type="submit" className="btn-admin-primary">
                            {modalType === 'editar' ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminCategorias;
