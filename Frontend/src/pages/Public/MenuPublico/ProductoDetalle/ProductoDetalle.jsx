import React from 'react';
import { Container, Spinner, Alert, Carousel } from 'react-bootstrap';
import { useProductoDetalle } from './useProductoDetalle';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
    const { producto, loading, error, handleBack } = useProductoDetalle();

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando detalles...</p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="text-center py-4 rounded-4">
                    <span className="material-symbols-outlined d-block mb-3" style={{ fontSize: '3rem' }}>error</span>
                    <h4>¡Ups! Algo salió mal</h4>
                    <p>{error || 'Producto no encontrado.'}</p>
                    <button className="btn btn-outline-danger mt-3" onClick={handleBack}>
                        Volver al Menú
                    </button>
                </Alert>
            </Container>
        );
    }

    return (
        <div className="producto-detalle-page fade-in">
            <Container fluid className="px-0 px-lg-3">
                <div className="producto-detalle-container">
                    
                    {/* Media Section */}
                    <div className="producto-detalle-media">
                        <button className="producto-detalle-back-btn" onClick={handleBack} aria-label="Volver">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>

                        {producto.imagePaths && producto.imagePaths.length > 0 ? (
                            <Carousel interval={5000} indicators={producto.imagePaths.length > 1} controls={producto.imagePaths.length > 1} className="h-100">
                                {producto.imagePaths.map((src, idx) => (
                                    <Carousel.Item key={idx} className="h-100">
                                        <img
                                            className="producto-detalle-img"
                                            src={src}
                                            alt={`${producto.nombre} - ${idx + 1}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light">
                                <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: '4rem' }}>image_not_supported</span>
                                <span className="text-muted fw-bold">Sin imágenes disponibles</span>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="producto-detalle-info">
                        <div className="producto-detalle-badge-row">
                            <span className="badge-categoria px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-pill fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                                {producto.categoria?.nombre || 'General'}
                            </span>
                            <div className="d-flex align-items-center gap-1 text-success fw-bold" style={{ fontSize: '0.9rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>check_circle</span>
                                Disponible
                            </div>
                        </div>

                        <h1 className="producto-detalle-nombre">{producto.nombre}</h1>

                        <div className="producto-detalle-precio">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '1.8rem' }}>sell</span>
                            <span className="amount">Bs {parseFloat(producto.precio).toFixed(0)}</span>
                            <span className="text-muted fw-500" style={{ fontSize: '1rem' }}>/ por unidad</span>
                        </div>

                        <div className="producto-detalle-desc-box">
                            <h4 className="producto-detalle-desc-title">
                                <span className="material-symbols-outlined">subject</span>
                                Descripción del Producto
                            </h4>
                            <p className="producto-detalle-desc-text">
                                {producto.descripcion || 'Este producto no cuenta con una descripción detallada en este momento.'}
                            </p>
                        </div>

                        <div className="producto-detalle-footer">
                            <p className="text-muted small d-flex align-items-center justify-content-center gap-2" style={{ opacity: 0.8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>restaurant</span>
                                Elaborado con los mejores estándares de calidad
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default ProductoDetalle;
