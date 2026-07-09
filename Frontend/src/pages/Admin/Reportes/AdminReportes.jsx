import React, { useState } from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import VentasGenerales from './VentasGenerales/VentasGenerales';
import VentasProducto from './VentasProducto/VentasProducto';
import RendimientoPersonal from './RendimientoPersonal/RendimientoPersonal';
import PedidosEliminados from './PedidosEliminados/PedidosEliminados';

const AdminReportes = () => {
    const [activeTab, setActiveTab] = useState('generales');

    return (
        <Container fluid className="px-0 admin-reportes-container h-100 d-flex flex-column">
            <div className="pb-3 mb-3 border-bottom" style={{ borderColor: 'rgba(180,66,10,0.12)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="admin-title-lg d-flex align-items-center gap-2 m-0">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            <span>Centro de Reportes</span>
                        </h1>
                        <p className="admin-subtitle mt-1 mb-0">
                            Visualiza y exporta métricas de ventas, inventario y personal.
                        </p>
                    </div>
                </div>

                <div className="w-100" style={{ paddingBottom: '4px' }}>
                    <div className="admin-tabs d-flex flex-wrap gap-1" style={{ background: 'rgba(180,66,10,0.06)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(180,66,10,0.12)' }}>
                        <Button
                            variant="link"
                            className="text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2"
                            style={{
                                color: activeTab === 'generales' ? '#fff' : 'var(--text-muted)',
                                background: activeTab === 'generales' ? 'var(--cafe-primary)' : 'transparent',
                                fontWeight: activeTab === 'generales' ? 600 : 500,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setActiveTab('generales')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>insights</span>
                            <span>Ventas Generales</span>
                        </Button>
                        <Button
                            variant="link"
                            className="text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2"
                            style={{
                                color: activeTab === 'productos' ? '#fff' : 'var(--text-muted)',
                                background: activeTab === 'productos' ? 'var(--cafe-primary)' : 'transparent',
                                fontWeight: activeTab === 'productos' ? 600 : 500,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setActiveTab('productos')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>local_cafe</span>
                            <span>Ventas por Producto</span>
                        </Button>
                        <Button
                            variant="link"
                            className="text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2"
                            style={{
                                color: activeTab === 'personal' ? '#fff' : 'var(--text-muted)',
                                background: activeTab === 'personal' ? 'var(--cafe-primary)' : 'transparent',
                                fontWeight: activeTab === 'personal' ? 600 : 500,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setActiveTab('personal')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>badge</span>
                            <span>Rendimiento del Personal</span>
                        </Button>
                        <Button
                            variant="link"
                            className="text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2"
                            style={{
                                color: activeTab === 'eliminados' ? '#fff' : 'var(--text-muted)',
                                background: activeTab === 'eliminados' ? 'var(--cafe-primary)' : 'transparent',
                                fontWeight: activeTab === 'eliminados' ? 600 : 500,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setActiveTab('eliminados')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete_history</span>
                            <span>Pedidos Eliminados</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 p-2 p-md-4" style={{ overflowY: 'auto' }}>
                {activeTab === 'generales' && <VentasGenerales />}
                {activeTab === 'productos' && <VentasProducto />}
                {activeTab === 'personal' && <RendimientoPersonal />}
                {activeTab === 'eliminados' && <PedidosEliminados />}
            </div>
        </Container>
    );
};

export default AdminReportes;
