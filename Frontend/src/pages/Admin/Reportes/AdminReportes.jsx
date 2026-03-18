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
            <div className="p-4 border-bottom" style={{ borderColor: 'var(--admin-border) !important', background: 'var(--admin-panel-bg)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="admin-title-lg m-0" style={{ fontSize: '2rem' }}>Centro de Reportes</h1>
                        <p className="admin-subtitle mt-1 mb-0" style={{ fontSize: '0.95rem' }}>
                            Visualiza y exporta métricas de ventas, inventario y personal.
                        </p>
                    </div>
                </div>

                <ButtonGroup className="admin-tabs" style={{ background: 'var(--admin-bg)', padding: '4px', borderRadius: '10px', display: 'inline-flex' }}>
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-2 rounded ${activeTab === 'generales' ? 'active-tab' : 'inactive-tab'}`}
                        style={{
                            color: activeTab === 'generales' ? 'var(--neon-primary)' : 'var(--admin-text-muted)',
                            background: activeTab === 'generales' ? 'var(--admin-accent)' : 'transparent',
                            fontWeight: activeTab === 'generales' ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setActiveTab('generales')}
                    >
                        Ventas Generales
                    </Button>
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-2 rounded ${activeTab === 'productos' ? 'active-tab' : 'inactive-tab'}`}
                        style={{
                            color: activeTab === 'productos' ? 'var(--neon-primary)' : 'var(--admin-text-muted)',
                            background: activeTab === 'productos' ? 'var(--admin-accent)' : 'transparent',
                            fontWeight: activeTab === 'productos' ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setActiveTab('productos')}
                    >
                        Ventas por Producto
                    </Button>
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-2 rounded ${activeTab === 'personal' ? 'active-tab' : 'inactive-tab'}`}
                        style={{
                            color: activeTab === 'personal' ? 'var(--neon-primary)' : 'var(--admin-text-muted)',
                            background: activeTab === 'personal' ? 'var(--admin-accent)' : 'transparent',
                            fontWeight: activeTab === 'personal' ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setActiveTab('personal')}
                    >
                        Rendimiento del Personal
                    </Button>
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-2 rounded ${activeTab === 'eliminados' ? 'active-tab' : 'inactive-tab'}`}
                        style={{
                            color: activeTab === 'eliminados' ? 'var(--neon-primary)' : 'var(--admin-text-muted)',
                            background: activeTab === 'eliminados' ? 'var(--admin-accent)' : 'transparent',
                            fontWeight: activeTab === 'eliminados' ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setActiveTab('eliminados')}
                    >
                        Pedidos Eliminados
                    </Button>
                </ButtonGroup>
            </div>

            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                {activeTab === 'generales' && <VentasGenerales />}
                {activeTab === 'productos' && <VentasProducto />}
                {activeTab === 'personal' && <RendimientoPersonal />}
                {activeTab === 'eliminados' && <PedidosEliminados />}
            </div>
        </Container>
    );
};

export default AdminReportes;
