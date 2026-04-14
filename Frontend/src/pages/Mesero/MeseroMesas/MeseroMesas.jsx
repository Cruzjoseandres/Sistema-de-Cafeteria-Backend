import { Container, Card, Badge, Spinner, Alert, Row, Col, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useMeseroMesas } from './useMeseroMesas';
import './MeseroMesas.css';

const MeseroMesas = () => {
    const {
        mesas, pedidosActivos, pedidosActivosFiltrados, loading, error,
        showCrearPedidoModal, setShowCrearPedidoModal,
        mesaSeleccionada, setMesaSeleccionada, mesasDisponibles,
        filtroMisPedidos, setFiltroMisPedidos,
        filtroBusqueda, setFiltroBusqueda,
        handleCrearPedido, handleAbrirPedido
    } = useMeseroMesas();

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
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

    const getEstadoVariant = (estado) => {
        if (!estado) return 'secondary';
        switch (estado.nombre) {
            case 'DISPONIBLE': return 'success';
            case 'OCUPADA': return 'danger';
            case 'RESERVADA': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <Container className="mt-4">
            {/* Header con botón crear pedido */}
            <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
                <h1 className="d-flex align-items-center gap-2 mb-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2.5rem' }}>deck</span>
                    Mesas y Pedidos
                </h1>
                <Button variant="primary" size="lg" onClick={() => setShowCrearPedidoModal(true)} className="shadow-sm">
                    <span className="material-symbols-outlined">add_circle</span>
                    Crear Pedido
                </Button>
            </div>

            {/* Pedidos activos */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                    <h5 className="mb-0">📋 Pedidos Activos</h5>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <InputGroup style={{ maxWidth: '280px' }}>
                            <InputGroup.Text className="bg-white border-end-0">
                                <span className="material-symbols-outlined text-muted" style={{ fontSize: '1.2rem' }}>search</span>
                            </InputGroup.Text>
                            <Form.Control 
                                placeholder="Mesa, Cliente, Pedido..."
                                className="border-start-0 ps-0"
                                style={{ boxShadow: 'none' }}
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                            />
                        </InputGroup>
                        <Form.Check 
                            type="switch"
                            id="mis-pedidos-switch"
                            label="Solo Mis Pedidos"
                            checked={filtroMisPedidos}
                            onChange={(e) => setFiltroMisPedidos(e.target.checked)}
                            className="fw-bold text-primary"
                        />
                    </div>
                </div>
                {pedidosActivosFiltrados.length === 0 ? (
                    <Alert variant="info" className="text-center">No hay pedidos activos disponibles.</Alert>
                ) : (
                    <Row>
                        {pedidosActivosFiltrados.map((pedido) => (
                            <Col key={pedido.id} xs={12} sm={6} lg={4} xl={3} className="mb-3">
                                <Card className="pedido-activo-card shadow-sm border-0 h-100 d-flex flex-column">
                                    <Card.Body className="pb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <Badge bg="success" className="px-2 py-1 fs-6">Pedido #{pedido.id}</Badge>
                                            <Badge bg="primary" className="px-2 py-1 fs-6 text-uppercase">
                                                {pedido.mesa?.es_juntada ? 'Mesa Juntada' : `Mesa ${pedido.mesa?.numero}`}
                                            </Badge>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <Badge bg="light" text="dark" className="border d-flex align-items-center p-1" style={{ width: "24px", height: "24px", justifyContent: "center" }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>person</span>
                                            </Badge>
                                            <span className="text-muted fw-bold small text-truncate" title="Mesero asignado">
                                                {pedido.usuario?.persona?.nombre} {pedido.usuario?.persona?.apellido}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <Badge bg="light" text="dark" className="border d-flex align-items-center p-1" style={{ width: "24px", height: "24px", justifyContent: "center" }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>groups</span>
                                            </Badge>
                                            <span className="text-secondary fw-bold small text-truncate" title="Cliente principal">
                                                {pedido.cuentas && pedido.cuentas.length > 0 ? pedido.cuentas[0].nombre_cliente : 'Sin Cliente'}
                                            </span>
                                        </div>
                                        <small className="text-muted d-flex align-items-center gap-2 mt-2">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>schedule</span>
                                            {new Date(pedido.fecha_apertura).toLocaleTimeString()}
                                        </small>
                                    </Card.Body>
                                    <Card.Footer className="bg-transparent border-top-0 pt-0 pb-3">
                                        <Row className="g-2">
                                            <Col xs={4}>
                                                <Button variant="outline-primary" size="sm" className="w-100 d-flex flex-column align-items-center p-1" onClick={(e) => { e.stopPropagation(); handleAbrirPedido(pedido, 'view'); }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>visibility</span>
                                                    <span style={{ fontSize: '0.7rem' }}>Ver</span>
                                                </Button>
                                            </Col>
                                            <Col xs={4}>
                                                <Button variant="outline-warning" size="sm" className="w-100 d-flex flex-column align-items-center p-1" onClick={(e) => { e.stopPropagation(); handleAbrirPedido(pedido, 'edit'); }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit</span>
                                                    <span style={{ fontSize: '0.7rem' }}>Editar</span>
                                                </Button>
                                            </Col>
                                            <Col xs={4}>
                                                <Button variant="outline-success" size="sm" className="w-100 d-flex flex-column align-items-center p-1" onClick={(e) => { e.stopPropagation(); handleAbrirPedido(pedido, 'deliver'); }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>local_shipping</span>
                                                    <span style={{ fontSize: '0.7rem' }}>Entregar</span>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Grid de mesas */}
            <h5 className="mb-3">🪑 Mesas</h5>
            <Row>
                {mesas.map((mesa) => {
                    const pedidosEnMesa = pedidosActivos.filter(p => p.mesa?.id === mesa.id);
                    const hasPedidos = pedidosEnMesa.length > 0;
                    
                    const handleClickMesa = () => {
                        if (mesa.es_juntada) {
                            // Si es juntada y tiene múltiples, no abrimos uno directamente
                            // porque el usuario debe elegirlos de la lista de arriba
                            if (pedidosEnMesa.length === 1) {
                                handleAbrirPedido(pedidosEnMesa[0]);
                            }
                        } else if (hasPedidos) {
                            handleAbrirPedido(pedidosEnMesa[0]);
                        }
                    };

                    return (
                        <Col key={mesa.id} xs={6} sm={4} md={3} lg={2} className="mb-3">
                            <Card
                                className={`mesa-card mesa-${mesa.estado?.nombre?.toLowerCase() || 'default'} ${hasPedidos ? 'mesa-con-pedido' : ''}`}
                                onClick={handleClickMesa}
                                style={{ cursor: hasPedidos ? 'pointer' : 'default' }}
                            >
                                <Card.Body className="text-center p-3 d-flex flex-column align-items-center justify-content-center position-relative">
                                    {mesa.es_juntada && (
                                        <Badge bg="info" className="position-absolute top-0 start-0 m-2" style={{ fontSize: '0.65rem' }}>
                                            <span className="material-symbols-outlined pe-1" style={{ fontSize: '0.7rem', verticalAlign: 'text-bottom' }}>groups</span>
                                            Juntada
                                        </Badge>
                                    )}
                                    <span className="material-symbols-outlined mb-2" style={{ fontSize: '2.5rem', opacity: 0.8 }}>table_restaurant</span>
                                    <strong className="mb-1">Mesa {mesa.numero}</strong>
                                    <Badge bg={getEstadoVariant(mesa.estado)} className="mt-1 px-3 py-1 bg-opacity-75" style={{ fontSize: '0.75rem' }}>
                                        {mesa.estado?.nombre || 'N/A'}
                                    </Badge>
                                    {hasPedidos && (
                                        <div className="mt-2 w-100">
                                            {mesa.es_juntada && pedidosEnMesa.length > 1 ? (
                                                <Badge bg="secondary" className="w-100 py-1" style={{ fontSize: '0.75rem', color: '#fff' }}>
                                                    {pedidosEnMesa.length} Pedidos
                                                </Badge>
                                            ) : (
                                                <Badge bg="warning" className="w-100 py-1" style={{ fontSize: '0.75rem', color: '#fff' }}>
                                                    Pedido #{pedidosEnMesa[0].id}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* ========== MODAL CREAR PEDIDO ========== */}
            <Modal show={showCrearPedidoModal} onHide={() => setShowCrearPedidoModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>📝 Crear Nuevo Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Asignar Mesa *</Form.Label>
                        <Form.Select
                            value={mesaSeleccionada}
                            onChange={(e) => setMesaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccione una mesa</option>
                            {mesasDisponibles.map((mesa) => (
                                <option key={mesa.id} value={mesa.id}>
                                    {mesa.es_juntada ? 'Mesa juntada' : `Mesa ${mesa.numero}`} — {mesa.capacidad} personas ({mesa.estado?.nombre || 'N/A'})
                                </option>
                            ))}
                        </Form.Select>
                        {mesasDisponibles.length === 0 && (
                            <small className="text-danger mt-1 d-block">No hay mesas sin pedido activo</small>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCrearPedidoModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCrearPedido} disabled={!mesaSeleccionada}>
                        Crear Pedido
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MeseroMesas;
