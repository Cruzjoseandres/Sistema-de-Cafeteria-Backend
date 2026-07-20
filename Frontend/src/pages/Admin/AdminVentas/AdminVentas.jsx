import React from 'react';
import { Container } from 'react-bootstrap';
import MeseroMesas from '../../Mesero/MeseroMesas/MeseroMesas';

const AdminVentas = () => {
    return (
        <Container fluid className="px-0">
            <div className="mb-4">
                <h1 className="admin-title-lg mb-1 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>point_of_sale</span>
                    <span>Nueva Venta & Terminal POS</span>
                </h1>
                <p className="admin-subtitle m-0">
                    Crea pedidos, asigna mesas, gestiona cuentas y procesa cobros directos para salón o para llevar.
                </p>
            </div>
            <MeseroMesas />
        </Container>
    );
};

export default AdminVentas;
