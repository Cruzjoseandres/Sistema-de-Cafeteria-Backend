import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Card } from 'react-bootstrap';
import ReporteService from '../../../../services/ReporteService';

const AdminActividad = () => {
    const [actividad, setActividad] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActividad = async () => {
            try {
                const data = await ReporteService.getActividadReciente();
                setActividad(data);
            } catch (error) {
                console.error("Error fetching actividad:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActividad();
    }, []);

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container fluid className="px-4 py-4">
            <h2 className="dashboard-title mb-4">Registro Completo de Actividad</h2>
            
            <Card className="content-card">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="custom-table mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>ARTÍCULOS</th>
                                    <th className="text-end">MONTO</th>
                                    <th className="text-end">ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actividad && actividad.length > 0 ? (
                                    actividad.map((order, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-bold">{order.id}</td>
                                            <td className="text-muted">{order.items}</td>
                                            <td className="text-end fw-bold">Bs. {parseFloat(order.amount).toFixed(2)}</td>
                                            <td className="text-end">
                                                <div className="d-flex flex-column align-items-end">
                                                    <span className={`status-badge ${order.status === 'Completado' ? 'success' : order.status === 'ELIMINADO' ? 'danger' : order.status === 'PENDIENTE' ? 'warning' : 'primary'}`}>
                                                        {order.status}
                                                    </span>
                                                    {order.status === 'ELIMINADO' && order.justificativo && (
                                                        <small className="text-danger fw-bold mt-1" style={{ fontSize: '0.7rem', maxWidth: '150px' }}>
                                                            Motivo: {order.justificativo}
                                                        </small>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">No hay actividad registrada</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminActividad;
