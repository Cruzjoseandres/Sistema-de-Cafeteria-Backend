import React from 'react';
import { Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useVentasGenerales } from './useVentasGenerales';
import PaginationBar from '../../../../components/PaginationBar';
import './VentasGenerales.css';

const VentasGenerales = () => {
    const { data, loading, error, totalIngresos, totalEfectivo, totalQr, pagination } = useVentasGenerales();

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="ventas-generales-container fade-in">
            <h4 className="mb-4">Ventas Generales</h4>
            <Row className="mb-4 g-3">
                <Col xs={12} sm={4}>
                    <Card className="admin-card text-center py-4 h-100">
                        <Card.Body>
                            <span className="material-symbols-outlined text-success mb-2" style={{ fontSize: '2rem' }}>payments</span>
                            <h6 className="text-muted">Efectivo</h6>
                            <h3 className="text-success">Bs. {totalEfectivo.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="admin-card text-center py-4 h-100">
                        <Card.Body>
                            <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: '2rem' }}>qr_code_2</span>
                            <h6 className="text-muted">QR / Transferencia</h6>
                            <h3 className="text-primary">Bs. {totalQr.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="admin-card text-center py-4 h-100">
                        <Card.Body>
                            <span className="material-symbols-outlined text-warning mb-2" style={{ fontSize: '2rem' }}>account_balance_wallet</span>
                            <h6 className="text-muted">Total Acumulado</h6>
                            <h3 className="text-warning">Bs. {totalIngresos.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="admin-card">
                <Card.Body>
                    <Table responsive hover className="admin-table m-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th className="text-end">
                                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>payments</span>
                                    Efectivo
                                </th>
                                <th className="text-end">
                                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>qr_code_2</span>
                                    QR
                                </th>
                                <th className="text-end fw-bold">Total del Día</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagination.paginatedData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fecha}</td>
                                    <td className="text-end text-success">Bs. {(item.total_efectivo || 0).toFixed(2)}</td>
                                    <td className="text-end text-primary">Bs. {(item.total_qr || 0).toFixed(2)}</td>
                                    <td className="text-end fw-bold">Bs. {item.total_ventas.toFixed(2)}</td>
                                </tr>
                            ))}
                            {pagination.totalItems === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">No hay datos de ventas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <PaginationBar {...pagination} />
        </div>
    );
};

export default VentasGenerales;

