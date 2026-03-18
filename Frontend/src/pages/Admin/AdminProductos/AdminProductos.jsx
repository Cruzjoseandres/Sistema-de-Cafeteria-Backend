import React, { useRef } from 'react';
import { Container, Table, Button, Form, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAdminProductos } from './useAdminProductos';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import './AdminProductos.css';

const AdminProductos = () => {
    const {
        productos, categorias, loading, error, showModal, modalType, formData, validated,
        handleOpenModal, handleCloseModal, handleChange, handleSubmit, handleDelete,
        toast, confirm, hideToast,
        existingImages, newImagePreviews, handleAddImages,
        handleRemoveExistingImage, handleRemoveNewImage
    } = useAdminProductos();

    const fileInputRef = useRef(null);

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

    const allPreviews = [
        ...existingImages.map((src, i) => ({ src, type: 'existing', index: i })),
        ...newImagePreviews.map((src, i) => ({ src, type: 'new', index: i })),
    ];

    // If showModal is true, we display the "Create/Edit" full page view instead of a Modal.
    // This perfectly matches the design expectation without altering the useAdminProductos logic.
    if (showModal) {
        return (
            <Container fluid className="px-0">
                <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
                <div className="mb-4">
                    <h1 className="admin-title-lg">{modalType === 'editar' ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
                    <p className="admin-subtitle">Añade o edita un artículo en el sistema de inventario de la cafetería.</p>
                </div>

                <div className="admin-card">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col md={7}>
                                <Form.Group className="admin-form-group">
                                    <Form.Label className="admin-form-label">Nombre del Producto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        placeholder="e.g., Wrap Picante de Pollo"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">El nombre del producto es obligatorio.</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="admin-form-group">
                                    <Form.Label className="admin-form-label">Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="descripcion"
                                        value={formData.descripcion || ''}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        placeholder="Ingresa los ingredientes, alérgenos, y otros detalles..."
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Precio ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="precio"
                                                value={formData.precio}
                                                onChange={handleChange}
                                                className="admin-form-control"
                                                placeholder="0.00"
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar un precio válido.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        {/* Original didn't have cost/stock fields but it had "disponible" instead. 
                                            To keep it similar, we use category select and disponible switch here */}
                                        <Form.Group className="admin-form-group">
                                            <Form.Label className="admin-form-label">Estado (Disponible)</Form.Label>
                                            <div style={{ paddingTop: '0.5rem' }}>
                                                <Form.Check
                                                    type="switch"
                                                    id="disponible-switch"
                                                    name="disponible"
                                                    label={formData.disponible ? "Disponible para la venta" : "Agotado / No disponible"}
                                                    checked={formData.disponible}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="admin-form-group mt-2">
                                    <Form.Label className="admin-form-label">Categoría</Form.Label>
                                    <Form.Select
                                        name="id_categoria"
                                        value={formData.id_categoria}
                                        onChange={handleChange}
                                        className="admin-form-control"
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">Por favor seleccione una categoría.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={5}>
                                <div className="admin-form-group">
                                    <Form.Label className="admin-form-label">Imagen del Producto</Form.Label>

                                    <div
                                        className="upload-area text-center"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            border: '2px dashed var(--admin-border)',
                                            borderRadius: '12px',
                                            padding: '3rem 1rem',
                                            cursor: 'pointer',
                                            marginBottom: '1rem',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--admin-accent)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
                                    >
                                        <div style={{ fontSize: '2rem', color: 'var(--admin-accent)', marginBottom: '0.5rem' }}>☁️</div>
                                        <div style={{ fontWeight: 600 }}>Click to upload</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>SVG, PNG, JPG or GIF (max. 800x400px)</div>
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleAddImages}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    {/* Previews map */}
                                    {allPreviews.length > 0 && (
                                        <div className="producto-previews-gallery mt-3">
                                            {allPreviews.map((item, idx) => (
                                                <div key={idx} className="producto-preview-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--admin-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)', width: '100%' }}>
                                                    <img
                                                        src={item.src}
                                                        alt={`Imagen ${idx + 1}`}
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Image {idx + 1}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Uploaded</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            item.type === 'existing'
                                                                ? handleRemoveExistingImage(item.index)
                                                                : handleRemoveNewImage(item.index)
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                                                        title="Eliminar imagen"
                                                    >🗑️</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
                            <button type="button" className="btn-admin-secondary" onClick={handleCloseModal}>Cancelar</button>
                            <button type="submit" className="btn-admin-primary">
                                {modalType === 'editar' ? 'Guardar Cambios' : 'Guardar Producto'}
                            </button>
                        </div>
                    </Form>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="px-0">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="admin-title-lg">Gestión de Productos</h1>
                    <p className="admin-subtitle m-0">Administra el inventario de la cafetería.</p>
                </div>
                <button className="btn-admin-primary" onClick={() => handleOpenModal('crear')}>
                    + Añadir Producto
                </button>
            </div>

            <div className="admin-card p-0" style={{ overflow: 'hidden' }}>
                <Table hover responsive className="custom-table m-0 align-middle">
                    <thead>
                        <tr>
                            <th>IMAGEN</th>
                            <th>NOMBRE</th>
                            <th>PRECIO</th>
                            <th>CATEGORÍA</th>
                            <th>ESTADO</th>
                            <th className="text-end">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td style={{ verticalAlign: 'middle' }}>
                                    {producto.imagePaths && producto.imagePaths.length > 0 ? (
                                        <div className="d-flex align-items-center gap-1">
                                            <img
                                                src={producto.imagePaths[0]}
                                                alt={producto.nombre}
                                                className="producto-img-thumb"
                                                style={{ width: '40px', height: '40px', borderRadius: '6px' }}
                                            />
                                            {producto.imagePaths.length > 1 && (
                                                <Badge bg="secondary" className="ms-1">+{producto.imagePaths.length - 1}</Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin imagen</span>
                                    )}
                                </td>
                                <td style={{ verticalAlign: 'middle', fontWeight: 600, color: 'var(--admin-text-main)' }}>{producto.nombre}</td>
                                <td style={{ verticalAlign: 'middle' }}>${parseFloat(producto.precio).toFixed(2)}</td>
                                <td style={{ verticalAlign: 'middle' }}>{producto.categoria?.nombre || '-'}</td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    {producto.disponible ? (
                                        <span className="admin-badge success">En Stock</span>
                                    ) : (
                                        <span className="admin-badge warning">Agotado</span>
                                    )}
                                </td>
                                <td className="text-end">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-admin-secondary d-flex align-items-center gap-1" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }} onClick={() => handleOpenModal('editar', producto)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit_square</span> Editar
                                        </button>
                                        <button className="btn-admin-secondary d-flex align-items-center gap-1" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', color: 'var(--neon-danger)', borderColor: 'rgba(220,53,69,0.2)' }} onClick={() => handleDelete(producto.id)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {productos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No se encontraron productos en el inventario.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default AdminProductos;
