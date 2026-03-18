import { Container, Card, Badge, Spinner, Alert, Row, Col, Button, Modal, Form, Table, Accordion, InputGroup } from 'react-bootstrap';
import { usePedidoView } from './usePedidoView';
import NotificationToast from '../../../components/NotificationToast';
import ConfirmModal from '../../../components/ConfirmModal';
import './PedidoView.css';

const PedidoView = () => {
    const {
        pedido, cuentas, detallesPorCuenta, productosFiltrados, categorias, totalPedido,
        viewMode, getClasificacionDetalle,
        loading, error, saving,
        hasUnsavedChanges, handleGuardarCambios, handleCancelarCambios,
        showAddCuentaModal, setShowAddCuentaModal,
        showAddItemModal, setShowAddItemModal,
        nombreCliente, setNombreCliente,
        busquedaProducto, setBusquedaProducto,
        filtroCategoria, setFiltroCategoria,
        filtroDisponible, setFiltroDisponible,
        productosSeleccionados, toggleProductoChecklist, updateChecklistCount, setChecklistCount, updateChecklistComment,
        handleAddCuenta, handleDeleteCuenta,
        handleOpenAddItem, handleAddMultipleItems,
        handleCambiarCantidadDetalle, handleDeleteDetalle, handleEntregarItem,
        handleTerminarPedido, handleCancelarPedido, confirmCancelarPedido, navigateBack,
        showJustificativoModal, setShowJustificativoModal,
        justificativoText, setJustificativoText,
        toast, confirm, hideToast,
        showPaymentModal, setShowPaymentModal,
        paymentData, setPaymentData,
        handleOpenPaymentModal,
        handleClosePaymentModal,
        handlePaymentDataChange,
        handleProcessPayment,
        showWhatsappModal, setShowWhatsappModal,
        whatsappPhone, setWhatsappPhone,
        handleOpenWhatsappModal,
        handleCloseWhatsappModal,
        handleShareWhatsapp
    } = usePedidoView();

    const isReadOnly = viewMode === 'view';
    const isDeliver = viewMode === 'deliver';
    const isEdit = viewMode === 'edit';
    const isPedidoCompletado = pedido?.estado?.id === 3 || pedido?.estado?.nombre === 'INACTIVO' || pedido?.estado?.nombre === 'COMPLETADO' || pedido?.estado?.nombre === 'PAGADO';

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error || !pedido) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error || 'Pedido no encontrado'}</Alert>
                <Button variant="secondary" onClick={navigateBack}>Volver a Mesas</Button>
            </Container>
        );
    }

    return (
        <Container fluid className="pedido-view-container p-3 p-md-4">
            <NotificationToast show={toast.show} message={toast.message} variant={toast.variant} onClose={hideToast} />
            <ConfirmModal show={confirm.show} message={confirm.message} onConfirm={confirm.onConfirm} confirmText={confirm.confirmText} confirmVariant={confirm.confirmVariant} />

            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 fade-in gap-3">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-secondary" onClick={navigateBack} className="d-flex align-items-center p-2 rounded-circle">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Button>
                    <div>
                        <h1 className="mb-0 d-flex align-items-center gap-2">
                            📋 Pedido #{pedido.id}
                            <Badge bg="info" className="ms-2">Mesa {pedido.mesa?.numero}</Badge>
                        </h1>
                        <small className="text-muted-custom mt-1 d-block">
                            👤 {pedido.usuario?.persona?.nombre} {pedido.usuario?.persona?.apellido}
                            {' · '}🕐 {new Date(pedido.fecha_apertura).toLocaleString()}
                            <Badge bg={viewMode === 'deliver' ? 'success' : viewMode === 'view' ? 'secondary' : 'warning'} className="ms-2">
                                Modo: {viewMode.toUpperCase()}
                            </Badge>
                        </small>
                    </div>
                </div>
                
                {isEdit && (
                    <div className="d-flex gap-2 mx-auto ms-md-auto me-md-0 align-items-center action-buttons flex-wrap justify-content-end">
                        <Button variant="info" className="d-flex align-items-center justify-content-center gap-1 shadow-sm text-white fw-bold px-4 py-2" onClick={handleOpenWhatsappModal} disabled={saving} style={{ minWidth: "180px", minHeight: "45px" }}>
                            <span className="material-symbols-outlined mb-1">share</span> Compartir
                        </Button>
                        {!isPedidoCompletado && (
                            <>
                                {hasUnsavedChanges ? (
                                    <>
                                        <Button variant="warning" className="d-flex align-items-center justify-content-center gap-1 shadow-sm text-dark fw-bold px-4 py-2" onClick={handleCancelarCambios} disabled={saving} style={{ minWidth: "180px", minHeight: "45px" }}>
                                            <span className="material-symbols-outlined mb-1">undo</span> Cancelar
                                        </Button>
                                        <Button variant="primary" className="d-flex align-items-center justify-content-center gap-1 shadow-sm fw-bold heartbeat-btn px-4 py-2" onClick={() => handleGuardarCambios(false)} disabled={saving} style={{ minWidth: "180px", minHeight: "45px" }}>
                                            {saving ? <Spinner size="sm" animation="border" className="mb-1" /> : <span className="material-symbols-outlined mb-1">save</span>} 
                                            Guardar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="success" className="d-flex align-items-center justify-content-center gap-1 shadow-sm fw-bold px-4 py-2" onClick={handleTerminarPedido} disabled={saving} style={{ minWidth: "180px", minHeight: "45px" }}>
                                            <span className="material-symbols-outlined mb-1">check_circle</span> Terminar Pedido
                                        </Button>
                                        <Button variant="danger" className="d-flex align-items-center justify-content-center gap-1 shadow-sm fw-bold px-4 py-2" onClick={handleCancelarPedido} disabled={saving} style={{ minWidth: "180px", minHeight: "45px" }}>
                                            <span className="material-symbols-outlined mb-1">delete_forever</span> Eliminar Pedido
                                        </Button>
                                        {/* General payment button removed: Payments are now per-cuenta. */}
                                    </>
                                )}
                            </>
                        )}

                    </div>
                )}
            </div>

            {/* ENCABEZADO DE ESTADO CANCELADO */}
            {pedido.estado?.nombre === 'ELIMINADO' && (
                <Alert variant="danger" className="mb-4 d-flex flex-column shadow-sm border-danger">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="material-symbols-outlined fs-3">warning</span>
                        <h4 className="alert-heading m-0 fw-bold">Pedido Anulado</h4>
                    </div>
                    <p className="mb-0">
                        <strong>Motivo registrado:</strong> {pedido.justificativo_eliminacion || 'Sin justificación'}
                    </p>
                </Alert>
            )}

            {/* CUENTAS Y DETALLES */}
            <Card className="glass-card shadow-lg mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h4 className="mb-0">Cuentas del Pedido</h4>
                        {isEdit && !isPedidoCompletado && (
                            <Button variant="primary" onClick={() => setShowAddCuentaModal(true)} className="d-flex align-items-center gap-1">
                                <span className="material-symbols-outlined animate-spin-hover">person_add</span> Nueva Cuenta
                            </Button>
                        )}
                    </div>

                    {cuentas.length === 0 ? (
                        <div className="py-5 text-center px-3">
                            <span className="material-symbols-outlined text-muted mb-3" style={{ fontSize: '4rem', opacity: 0.5 }}>receipt_long</span>
                            <h5 className="text-muted">No hay cuentas activas</h5>
                            <p className="text-muted mb-0">Comienza creando una cuenta para agregar productos al pedido.</p>
                        </div>
                    ) : (
                        <Accordion defaultActiveKey={cuentas.map((_, i) => String(i))} alwaysOpen className="custom-accordion">
                            {cuentas.map((cuenta, index) => {
                                const detalles = detallesPorCuenta[cuenta.id] || [];
                                return (
                                    <Accordion.Item eventKey={String(index)} key={cuenta.id} className="mb-3 border rounded shadow-sm">
                                        <Accordion.Header>
                                            <div className="d-flex justify-content-between w-100 me-3 align-items-center pe-2">
                                                <span className="fs-5"><strong>👤 {cuenta.nombre_cliente}</strong></span>
                                                <Badge bg="primary" className="fs-6 py-2 px-3">
                                                    Bs. {Number(cuenta.total || 0).toFixed(2)}
                                                </Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-light">
                                            {isEdit && (
                                                <div className="d-flex justify-content-end gap-2 mb-3">
                                                    {cuenta.estado?.id !== 3 ? (
                                                        <>
                                                            <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-1"
                                                                onClick={() => handleDeleteCuenta(cuenta.id)}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span> Eliminar
                                                            </Button>
                                                            <Button variant="primary" size="sm" className="d-flex align-items-center gap-1 shadow-sm"
                                                                onClick={() => handleOpenAddItem(cuenta.id)}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>add_circle</span> Agregar Prod.
                                                            </Button>
                                                            <Button variant="success" size="sm" className="d-flex align-items-center gap-1 shadow-sm fw-bold px-3 text-white"
                                                                onClick={() => handleOpenPaymentModal(cuenta.id)}>
                                                                <span className="material-symbols-outlined fs-6">payments</span> Cobrar
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Badge bg="success" className="py-2 px-3 d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined fs-6">check_circle</span> Cuenta Pagada
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {detalles.length === 0 ? (
                                                <div className="text-center py-4 bg-white rounded border border-dashed">
                                                    <span className="material-symbols-outlined text-muted" style={{ fontSize: '2rem', opacity: 0.5 }}>restaurant_menu</span>
                                                    <p className="text-muted mt-2 mb-0">Sin productos en esta cuenta</p>
                                                </div>
                                            ) : (
                                                <div className="bg-white rounded shadow-sm overflow-hidden">
                                                    {/* Helper para renderizar tabla de detalles */}
                                                    {[
                                                        { titulo: 'Pedido Inicial', items: detalles.filter(d => getClasificacionDetalle(d) === 'Pedido Inicial') },
                                                        { titulo: 'Extras', items: detalles.filter(d => getClasificacionDetalle(d) === 'Extras') }
                                                    ].map((grupo, gIdx) => grupo.items.length > 0 && (
                                                        <div key={gIdx} className="mb-0">
                                                            <div className="bg-light border-bottom px-3 py-2 fw-bold text-secondary d-flex align-items-center gap-2">
                                                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                                                                    {grupo.titulo === 'Extras' ? 'extension' : 'receipt'}
                                                                </span>
                                                                {grupo.titulo}
                                                            </div>
                                                            <Table hover className="mb-0 align-middle" style={{ tableLayout: 'fixed' }}>
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th style={{ width: '35%' }}>Producto</th>
                                                                        <th className="text-center" style={{ width: '160px' }}>Entregado / Total</th>
                                                                        {!isDeliver && <th className="text-end" style={{ width: '100px' }}>Subtotal</th>}
                                                                        <th className="px-3">Nota</th>
                                                                        {isEdit && <th className="text-center" style={{ width: '60px' }}>Acción</th>}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {grupo.items.map((det) => (
                                                                        <tr key={det.id}>
                                                                            <td className="fw-medium">{det.producto?.nombre}</td>
                                                                            <td>
                                                                                {isDeliver ? (
                                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                                        <Button variant="outline-secondary" size="sm" className="btn-qty px-2 rounded-start"
                                                                                            disabled={det.cantidad_entregada <= 0}
                                                                                            onClick={() => handleEntregarItem(det.id, det.cantidad_entregada - 1)}>
                                                                                            -
                                                                                        </Button>
                                                                                        <div className="px-2 border-top border-bottom py-1 fw-bold bg-light d-flex gap-1 align-items-center">
                                                                                            <Form.Control
                                                                                                type="number"
                                                                                                className={`p-0 text-center fw-bold border-0 bg-transparent ${det.cantidad_entregada === det.cantidad ? 'text-success' : 'text-primary'}`}
                                                                                                style={{ width: '35px', boxShadow: 'none' }}
                                                                                                defaultValue={det.cantidad_entregada}
                                                                                                key={`deliv-${det.id}-${det.cantidad_entregada}`}
                                                                                                onBlur={(e) => {
                                                                                                    let val = parseInt(e.target.value);
                                                                                                    if (isNaN(val) || val < 0) val = 0;
                                                                                                    if (val > det.cantidad) val = det.cantidad;
                                                                                                    e.target.value = val;
                                                                                                    if (val !== det.cantidad_entregada) {
                                                                                                        handleEntregarItem(det.id, val);
                                                                                                    }
                                                                                                }}
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter') e.target.blur();
                                                                                                }}
                                                                                            />
                                                                                            <span className="text-muted">/</span>
                                                                                            <span className="text-muted">{det.cantidad}</span>
                                                                                        </div>
                                                                                        <Button variant="outline-secondary" size="sm" className="btn-qty px-2 rounded-end"
                                                                                            disabled={det.cantidad_entregada >= det.cantidad}
                                                                                            onClick={() => handleEntregarItem(det.id, det.cantidad_entregada + 1)}>
                                                                                            +
                                                                                        </Button>
                                                                                    </div>
                                                                                ) : (isEdit && cuenta.estado?.id !== 3) ? (
                                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                                        <Button variant="outline-secondary" size="sm" className="btn-qty px-2 rounded-start"
                                                                                            onClick={() => handleCambiarCantidadDetalle(det.id, det.cantidad - 1)}>
                                                                                            -
                                                                                        </Button>
                                                                                        <div className="px-2 border-top border-bottom py-1 fw-bold bg-light">
                                                                                            <Form.Control
                                                                                                type="number"
                                                                                                className="p-0 text-center fw-bold border-0 bg-transparent"
                                                                                                style={{ width: '40px', boxShadow: 'none' }}
                                                                                                defaultValue={det.cantidad}
                                                                                                key={`edit-${det.id}-${det.cantidad}`}
                                                                                                onBlur={(e) => {
                                                                                                    let val = parseInt(e.target.value);
                                                                                                    if (isNaN(val) || val < 0) val = 0;
                                                                                                    e.target.value = val;
                                                                                                    if (val !== det.cantidad) {
                                                                                                        handleCambiarCantidadDetalle(det.id, val);
                                                                                                    }
                                                                                                }}
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter') e.target.blur();
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <Button variant="outline-secondary" size="sm" className="btn-qty px-2 rounded-end"
                                                                                            onClick={() => handleCambiarCantidadDetalle(det.id, det.cantidad + 1)}>
                                                                                            +
                                                                                        </Button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-center fw-bold">
                                                                                        <span className={`${det.cantidad_entregada === det.cantidad ? 'text-success' : 'text-primary'} fs-5`}>{det.cantidad_entregada}</span>
                                                                                        <span className="text-muted mx-1">/</span>
                                                                                        <span className="text-muted">{det.cantidad}</span>
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            {!isDeliver && <td className="text-end fw-bold text-success">Bs. {Number(det.subtotal).toFixed(2)}</td>}
                                                                            <td className="px-3 text-muted" style={{ maxWidth: '150px' }}>
                                                                                <div className="text-truncate">{det.comentario || '-'}</div>
                                                                            </td>
                                                                            {isEdit && cuenta.estado?.id !== 3 && (
                                                                                <td className="text-center">
                                                                                    <Button variant="outline-danger" className="p-1 d-flex align-items-center justify-content-center mx-auto border-0"
                                                                                        onClick={() => handleDeleteDetalle(det.id)}>
                                                                                        <span className="material-symbols-outlined">delete</span>
                                                                                    </Button>
                                                                                </td>
                                                                            )}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion>
                    )}

                    {cuentas.length > 0 && (
                        <div className="total-pedido-container mt-4 p-4 rounded text-end shadow-sm d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 text-muted">Total del Pedido</h4>
                            <h2 className="mb-0 fw-bold text-primary display-6">Bs. {totalPedido.toFixed(2)}</h2>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* ========== MODAL AGREGAR CUENTA ========== */}
            <Modal show={showAddCuentaModal} onHide={() => setShowAddCuentaModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span> Nueva Cuenta
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nombre del cliente *</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            placeholder="Ej: Juan, Mesa completa, etc."
                            className="bg-light"
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={() => setShowAddCuentaModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleAddCuenta} disabled={!nombreCliente.trim()} className="px-4">
                        Crear Cuenta
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ========== MODAL AGREGAR PRODUCTOS (CHECKLIST) ========== */}
            <Modal show={showAddItemModal} onHide={() => setShowAddItemModal(false)} size="xl" centered>
                <Modal.Header closeButton className="border-bottom-0 pb-2">
                    <Modal.Title className="d-flex align-items-center gap-2 w-100">
                        <span className="material-symbols-outlined text-warning">fastfood</span>
                        <span>Seleccionar Productos</span>
                        <Badge bg="primary" className="ms-auto" style={{ fontSize: '1rem' }}>
                            {Object.keys(productosSeleccionados).length} seleccionados
                        </Badge>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 bg-light">
                    <div className="py-3 bg-white border-bottom sticky-top shadow-sm">
                        <Container fluid>
                            <Row className="g-2">
                                <Col md={6}>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-white"><span className="material-symbols-outlined fs-5">search</span></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar producto por nombre..."
                                            value={busquedaProducto}
                                            onChange={(e) => setBusquedaProducto(e.target.value)}
                                            autoFocus
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={3} xs={6}>
                                    <Form.Select
                                        value={filtroCategoria}
                                        onChange={(e) => setFiltroCategoria(e.target.value)}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={3} xs={6}>
                                    <Form.Select
                                        value={filtroDisponible}
                                        onChange={(e) => setFiltroDisponible(e.target.value)}
                                    >
                                        <option value="disponible">Solo disponibles</option>
                                        <option value="todos">Todos</option>
                                        <option value="agotado">Solo agotados</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Container>
                    </div>

                    <div className="productos-lista checklist-container p-3 p-md-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {productosFiltrados.length === 0 ? (
                            <div className="text-center py-5">
                                <span className="material-symbols-outlined text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}>search_off</span>
                                <h5 className="text-muted mt-3">No se encontraron productos</h5>
                            </div>
                        ) : (
                            <Row className="g-3">
                                {productosFiltrados.map((p) => {
                                    const seleccionado = productosSeleccionados[p.id];
                                    const isAgotado = !p.disponible;
                                    
                                    return (
                                        <Col lg={6} xl={4} key={p.id}>
                                            <div className={`p-3 border rounded shadow-sm d-flex flex-column h-100 transition-all ${seleccionado ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'} ${isAgotado ? 'opacity-50 grayscale' : ''}`}>
                                                
                                                <div className="d-flex align-items-center mb-3 cursor-pointer" 
                                                     onClick={() => !isAgotado && toggleProductoChecklist(p.id)}
                                                >
                                                    <div className="me-3">
                                                        <Form.Check 
                                                            type="checkbox"
                                                            checked={!!seleccionado}
                                                            onChange={() => {}} // handled by parent div
                                                            className="scale-15"
                                                            disabled={isAgotado}
                                                        />
                                                    </div>
                                                    
                                                    {p.imagePaths && p.imagePaths.length > 0 ? (
                                                        <img src={p.imagePaths[0]} alt={p.nombre} className="rounded object-fit-cover me-3 shadow-sm" style={{ width: '60px', height: '60px' }} />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                                                            <span className="material-symbols-outlined text-muted">image</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0 fw-bold">{p.nombre}</h6>
                                                        <small className="text-muted">{p.categoria?.nombre}</small>
                                                        {isAgotado && <Badge bg="secondary" className="ms-2">Agotado</Badge>}
                                                    </div>
                                                    
                                                    <div className="fs-5 fw-bold text-success text-end ms-2">
                                                        Bs. {parseFloat(p.precio).toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Expanded options for selected item */}
                                                {seleccionado && (
                                                    <div className="mt-auto pt-3 border-top mt-2 fade-in">
                                                        <Row className="g-2">
                                                            <Col xs={5}>
                                                                <div className="d-flex align-items-center border bg-white rounded">
                                                                    <Button variant="light" className="border-0 px-2 rounded-start" onClick={() => updateChecklistCount(p.id, -1)}>-</Button>
                                                                    <Form.Control 
                                                                        type="number"
                                                                        className="border-0 text-center fw-bold p-1 hide-arrows rounded-0"
                                                                        style={{ width: '45px', minWidth: '45px' }}
                                                                        value={seleccionado.cantidad}
                                                                        onChange={(e) => setChecklistCount(p.id, e.target.value)}
                                                                        onBlur={(e) => {
                                                                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                                                setChecklistCount(p.id, '1');
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Button variant="light" className="border-0 px-2 rounded-end" onClick={() => updateChecklistCount(p.id, 1)}>+</Button>
                                                                </div>
                                                            </Col>
                                                            <Col xs={7}>
                                                                <Form.Control 
                                                                    type="text" 
                                                                    size="sm"
                                                                    placeholder="Nota: Ej. Sin hielo" 
                                                                    value={seleccionado.comentario}
                                                                    onChange={(e) => updateChecklistComment(p.id, e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0 mt-3 px-4">
                    <Button variant="light" onClick={() => setShowAddItemModal(false)} className="px-4">Cancelar</Button>
                    <Button variant="primary" onClick={handleAddMultipleItems} disabled={Object.keys(productosSeleccionados).length === 0} className="px-4 py-2 d-flex align-items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined">add_task</span>
                        Agregar {Object.keys(productosSeleccionados).length > 0 ? Object.keys(productosSeleccionados).length : ''} al Pedido
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL PAGO DE CUENTA */}
            <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered backdrop="static" size="md">
                <Modal.Header closeButton className="bg-success text-white border-bottom-0 pb-4">
                    <Modal.Title className="d-flex align-items-center gap-2 m-0 fs-4 fw-bold">
                        <span className="material-symbols-outlined">point_of_sale</span>
                        Procesar Pago
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-4 pt-1 position-relative">
                    <div className="bg-white rounded-circle position-absolute start-50 translate-middle-x shadow-sm d-flex align-items-center justify-content-center" style={{ top: '-30px', width: '60px', height: '60px' }}>
                        <span className="material-symbols-outlined text-success" style={{ fontSize: '2rem' }}>receipt_long</span>
                    </div>

                    <div className="text-center mt-4 mb-4">
                        <h6 className="text-muted text-uppercase mb-1" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Total a Pagar</h6>
                        <h1 className="display-4 fw-bold text-dark m-0">Bs. {paymentData.totalCuenta?.toFixed(2)}</h1>
                    </div>

                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-secondary">Método de Pago</Form.Label>
                            <div className="d-flex gap-3">
                                <div 
                                    className={`payment-method-card flex-grow-1 p-3 border rounded text-center cursor-pointer transition-all ${paymentData.tipo_pago === 'Efectivo' ? 'border-success bg-success bg-opacity-10' : 'bg-light'}`}
                                    onClick={() => handlePaymentDataChange('tipo_pago', 'Efectivo')}
                                >
                                    <span className={`material-symbols-outlined fs-2 mb-2 ${paymentData.tipo_pago === 'Efectivo' ? 'text-success' : 'text-muted'}`}>payments</span>
                                    <p className={`m-0 fw-bold ${paymentData.tipo_pago === 'Efectivo' ? 'text-success' : 'text-muted'}`}>Efectivo</p>
                                </div>
                                <div 
                                    className={`payment-method-card flex-grow-1 p-3 border rounded text-center cursor-pointer transition-all ${paymentData.tipo_pago === 'QR' ? 'border-success bg-success bg-opacity-10' : 'bg-light'}`}
                                    onClick={() => handlePaymentDataChange('tipo_pago', 'QR')}
                                >
                                    <span className={`material-symbols-outlined fs-2 mb-2 ${paymentData.tipo_pago === 'QR' ? 'text-success' : 'text-muted'}`}>qr_code_2</span>
                                    <p className={`m-0 fw-bold ${paymentData.tipo_pago === 'QR' ? 'text-success' : 'text-muted'}`}>Pago QR</p>
                                </div>
                            </div>
                        </Form.Group>

                        {/* CONTROLES PARA EFECTIVO */}
                        {paymentData.tipo_pago === 'Efectivo' && (
                            <div className="payment-details fade-in">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-secondary">Monto Recibido</Form.Label>
                                    <InputGroup size="lg">
                                        <InputGroup.Text className="bg-light fw-bold text-muted">Bs.</InputGroup.Text>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="0.00"
                                            className="fw-bold"
                                            value={paymentData.monto_pagado}
                                            onChange={(e) => handlePaymentDataChange('monto_pagado', e.target.value)}
                                            autoFocus
                                        />
                                    </InputGroup>
                                </Form.Group>
                                
                                <div className="d-flex justify-content-between align-items-center p-3 rounded bg-light border">
                                    <span className="fw-bold text-muted">Cambio a devolver:</span>
                                    <span className={`fs-4 fw-bold ${paymentData.monto_cambio > 0 ? 'text-primary' : 'text-muted'}`}>
                                        Bs. {paymentData.monto_cambio?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CONTROLES PARA QR */}
                        {paymentData.tipo_pago === 'QR' && (
                            <div className="payment-details fade-in d-flex flex-column align-items-center">
                                <div className="qr-box p-2 border rounded bg-white shadow-sm mb-3">
                                    <img 
                                        src={paymentData.qrUrl} 
                                        alt="Código QR del Local" 
                                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <p className="text-center text-muted mb-3">Muestra este código al cliente para que realice la transferencia de <strong>Bs. {paymentData.totalCuenta?.toFixed(2)}</strong>.</p>
                                
                                <div className="w-100 mt-2">
                                    <Form.Label className="fw-bold text-secondary">Comprobantes (Opcional)</Form.Label>
                                    <div className="input-group">
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="comprobantes-upload" 
                                            multiple 
                                            accept="image/*"
                                            onChange={(e) => {
                                                // TODO: Implementation for real image upload. 
                                                // For now, we simulate saving dummy filenames or we can leave empty.
                                                const files = Array.from(e.target.files).map(f => f.name);
                                                handlePaymentDataChange('comprobantes', files);
                                            }}
                                        />
                                    </div>
                                    <small className="text-muted mt-1 d-block">Sube capturas de pantalla de la transferencia.</small>
                                </div>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0 px-4 pb-4 border-top">
                    <Button variant="light" onClick={handleClosePaymentModal} className="px-4 border">Cancelar</Button>
                    <Button 
                        variant="success" 
                        onClick={handleProcessPayment} 
                        disabled={saving} 
                        className="px-4 d-flex align-items-center gap-2 fw-bold text-white fs-6 py-2 w-100 mt-3"
                    >
                        {saving ? <Spinner size="sm" animation="border" /> : <span className="material-symbols-outlined">check_circle</span>}
                        Confirmar Pago
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL COMPARTIR WHATSAPP */}
            <Modal show={showWhatsappModal} onHide={handleCloseWhatsappModal} centered>
                <Modal.Header closeButton className="bg-info text-white border-bottom-0 pb-4">
                    <Modal.Title className="d-flex align-items-center gap-2 m-0 fs-4 fw-bold">
                        <span className="material-symbols-outlined">share</span>
                        Compartir Detalle por WhatsApp
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-4 pt-4 position-relative">
                    <div className="text-center mb-4">
                        <span className="material-symbols-outlined text-info" style={{ fontSize: '4rem' }}>forum</span>
                        <p className="text-muted mt-3">Ingresa el número de teléfono del cliente con el código de país (ej. +591 xxxxxxxx) para enviarle el PDF del pedido.</p>
                    </div>

                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-secondary">Número de WhatsApp</Form.Label>
                            <InputGroup size="lg">
                                <InputGroup.Text className="bg-light fw-bold text-muted"><span className="material-symbols-outlined fs-5">call</span></InputGroup.Text>
                                <Form.Control 
                                    type="tel" 
                                    placeholder="+591 61234567"
                                    className="fw-bold"
                                    value={whatsappPhone}
                                    onChange={(e) => setWhatsappPhone(e.target.value)}
                                    autoFocus
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0 px-4 pb-4 border-top">
                    <Button variant="light" onClick={handleCloseWhatsappModal} className="px-4 border">Cancelar</Button>
                    <Button 
                        variant="info" 
                        onClick={handleShareWhatsapp} 
                        disabled={saving || !whatsappPhone} 
                        className="px-4 d-flex align-items-center gap-2 fw-bold text-white fs-6 py-2"
                    >
                        {saving ? <Spinner size="sm" animation="border" /> : <span className="material-symbols-outlined">send</span>}
                        Enviar Mensaje
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showJustificativoModal} onHide={() => !saving && setShowJustificativoModal(false)} centered>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title className="d-flex align-items-center gap-2 text-danger">
                        <span className="material-symbols-outlined fs-3">warning</span>
                        Justificar Eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">Por favor, ingresa el motivo por el cual estás eliminando este pedido. Esta acción quedará registrada para auditoría.</p>
                    <Form.Group>
                        <Form.Label>Motivo de la eliminación (obligatorio):</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ej. El cliente se retiró antes de ser atendido..."
                            value={justificativoText}
                            onChange={(e) => setJustificativoText(e.target.value)}
                            disabled={saving}
                            autoFocus
                        />
                        {justificativoText.trim().length > 0 && justificativoText.trim().length < 5 && (
                            <Form.Text className="text-danger">El justificativo debe tener al menos 5 caracteres.</Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowJustificativoModal(false)} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmCancelarPedido} disabled={saving || justificativoText.trim().length < 5}>
                        {saving ? <><Spinner size="sm" className="me-2" />Eliminando...</> : 'Confirmar Eliminación'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default PedidoView;
