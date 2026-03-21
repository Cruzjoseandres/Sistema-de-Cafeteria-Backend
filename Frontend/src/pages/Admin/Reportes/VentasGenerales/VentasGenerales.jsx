import React from 'react';
import { Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useVentasGenerales } from './useVentasGenerales';
import './VentasGenerales.css'; // Opcional, reservado para estilos específicos

const VentasGenerales = () => {
    const { data, loading, error, totalIngresos } = useVentasGenerales();

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
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="admin-card text-center py-4">
                        <Card.Body>
                            <h5 className="text-muted">Total Acumulado</h5>
                            <h2 className="text-success">Bs. {totalIngresos.toFixed(2)}</h2>
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
                                <th className="text-end">Total de Ventas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.fecha}</td>
                                        <td className="text-end font-weight-bold">Bs. {item.total_ventas.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-muted">No hay datos de ventas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default VentasGenerales;
