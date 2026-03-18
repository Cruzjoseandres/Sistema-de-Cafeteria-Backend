import React from 'react';
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { useVentasProducto } from './useVentasProducto';
import './VentasProducto.css'; // Opcional, reservado para estilos específicos

const VentasProducto = () => {
    const { data, loading, error } = useVentasProducto();

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
        <div className="ventas-producto-container fade-in">
            <h4 className="mb-4">Ventas por Producto</h4>
            <Card className="admin-card">
                <Card.Body>
                    <Table responsive hover className="admin-table m-0">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad Vendida</th>
                                <th className="text-end">Ingreso Generado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.producto}</strong></td>
                                        <td>
                                            <Badge bg="info">{item.cantidad_vendida} ud.</Badge>
                                        </td>
                                        <td className="text-end font-weight-bold text-success">${item.ingreso_generado.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">No hay productos vendidos aún</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default VentasProducto;
