import React, { useState } from 'react';
import { Card, Table, Spinner, Alert, Form, Button, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useRendimientoPersonal } from './useRendimientoPersonal';
import './RendimientoPersonal.css';

const RendimientoPersonal = () => {
    const { 
        data, loading, error, fetchData,
        pedidosMesero, loadingPedidos, showModal, selectedMesero,
        fetchPedidosMesero, closeModal
    } = useRendimientoPersonal();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const handleFilter = () => {
        fetchData(startDate, endDate);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Cargando rendimiento de personal...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="rendimiento-personal-container fade-in">
            <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                <div>
                    <h4 className="section-title m-0">Rendimiento de Personal</h4>
                    <p className="text-muted mt-1">Métricas de pedidos atendidos por cada mesero y ventas totales.</p>
                </div>
                <div className="d-flex flex-wrap align-items-end gap-2 date-filters pb-2">
                    <Form.Group>
                        <Form.Label className="small text-muted mb-1">Desde</Form.Label>
                        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="sm" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="small text-muted mb-1">Hasta</Form.Label>
                        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="sm" />
                    </Form.Group>
                    <Button variant="primary" size="sm" onClick={handleFilter}>
                        Filtrar
                    </Button>
                </div>
            </div>

            <Card className="content-card border-0">
                <Card.Body className="p-0">
                    <Table responsive hover className="custom-table m-0">
                        <thead>
                            <tr className="text-nowrap">
                                <th className="ps-4">MESERO</th>
                                <th className="text-center">PEDIDOS ATENDIDOS</th>
                                <th className="text-end pe-4">TOTAL RECAUDADO (Bs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => fetchPedidosMesero(item.usuario_id, item.mesero)}
                                        style={{ cursor: 'pointer' }}
                                        className="row-hover-highlight"
                                        title="Click para ver pedidos"
                                    >
                                        <td className="ps-4 fw-bold align-middle text-nowrap">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="personal-avatar flex-shrink-0">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                                {item.mesero}
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <span className="qty-badge d-inline-flex align-items-center gap-1">
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>receipt_long</span>
                                                {item.pedidos_atendidos}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4 align-middle fw-bold text-success">
                                            Bs. {item.total_recaudado?.toFixed(2) || '0.00'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-5">No hay datos de rendimiento disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={closeModal} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                        Pedidos Atendidos: {selectedMesero}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {loadingPedidos ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Cargando pedidos...</p>
                        </div>
                    ) : (
                        <Table responsive hover className="m-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID Pedido</th>
                                    <th>Fecha</th>
                                    <th>Mesa</th>
                                    <th>Estado</th>
                                    <th className="text-end">Total Recaudado</th>
                                    <th className="text-center pe-4">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosMesero.length > 0 ? (
                                    pedidosMesero.map((p) => (
                                        <tr key={p.id}>
                                            <td className="ps-4 fw-bold">#{p.id}</td>
                                            <td>{new Date(p.fecha).toLocaleString()}</td>
                                            <td>Mesa {p.mesa_numero}</td>
                                            <td>
                                                <Badge bg={p.estado_nombre === 'COMPLETADO' || p.estado_nombre === 'PAGADO' ? 'success' : 'secondary'}>
                                                    {p.estado_nombre}
                                                </Badge>
                                            </td>
                                            <td className="text-end fw-bold text-success">Bs. {p.total_recaudado.toFixed(2)}</td>
                                            <td className="text-center pe-4">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/pedido/${p.id}?mode=view`, { state: { from: '/admin/reportes' }})}
                                                >
                                                    Ver Detalle
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No se encontraron pedidos concretados para este mesero en este rango de fechas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default RendimientoPersonal;
