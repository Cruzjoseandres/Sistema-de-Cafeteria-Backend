import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Spinner, Alert, Row, Col, Modal, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMenuPublico, getCategoriasPublicas } from '../../../../services/PublicService';
import { getAccessToken } from '../../../../utils/TokenUtilities';
import './MenuPublico.css';

/* ---------- Main Component ---------- */
const MenuPublico = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const token = getAccessToken();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [prodData, catData] = await Promise.all([
                getMenuPublico(),
                getCategoriasPublicas()
            ]);
            setProductos(prodData);
            setCategorias(catData);
            setError(null);
        } catch (err) {
            console.error('Error al cargar menú:', err);
            setError('Error al cargar el menú');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredProductos = categoriaFilter
        ? productos.filter(p => p.categoria?.id === parseInt(categoriaFilter))
        : productos;

    // Group by category
    const grouped = filteredProductos.reduce((acc, p) => {
        const key = p.categoria?.nombre || 'Sin categoría';
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" style={{ color: 'var(--neon-primary)' }}>
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-3 text-muted">Cargando menú...</p>
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

    return (
        <Container className="mt-3 pb-5" style={{ maxWidth: '1400px' }}>

            {/* Header */}
            <div className="menu-publico-header fade-in">
                <h1 className="d-flex justify-content-center align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>coffee</span>
                    Nuestro Menú
                </h1>
                <p>Descubre lo que tenemos preparado para ti hoy</p>
            </div>

            {/* Login Banner */}
            {!token && (
                <div className="menu-login-banner fade-in">
                    <p className="mb-0">
                        <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.2rem' }}>login</span>
                        Inicia sesión para hacer un pedido
                    </p>
                    <Link to="/login">
                        <button className="btn btn-primary btn-sm px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
                            Iniciar Sesión
                        </button>
                    </Link>
                </div>
            )}

            {/* Category Chips */}
            <div className="menu-category-chips fade-in">
                <button
                    className={`menu-chip ${categoriaFilter === '' ? 'active' : ''}`}
                    onClick={() => setCategoriaFilter('')}
                >
                    Todos
                </button>
                {categorias.map(cat => (
                    <button
                        key={cat.id}
                        className={`menu-chip ${categoriaFilter === String(cat.id) ? 'active' : ''}`}
                        onClick={() => setCategoriaFilter(String(cat.id))}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {/* Products */}
            {Object.keys(grouped).length === 0 ? (
                <Alert variant="warning" className="text-center py-5 fade-in mx-auto" style={{ maxWidth: '400px', borderRadius: '16px' }}>
                    <span className="material-symbols-outlined d-block mb-3" style={{ fontSize: '3rem', color: '#ffc107' }}>search_off</span>
                    <h5 style={{ fontWeight: 700 }}>No hay productos disponibles</h5>
                    <p className="mb-0 text-muted">Prueba seleccionando otra categoría</p>
                </Alert>
            ) : (
                Object.entries(grouped).map(([categoria, prods]) => (
                    <div key={categoria} className="mb-5 fade-in">
                        <h2 className="menu-categoria-titulo">{categoria}</h2>
                        {/* 1 col on mobile, 2 col on tablet, 3 col on large desktop */}
                        <Row className="g-3 g-md-4">
                            {prods.map((producto) => (
                                <Col key={producto.id} xs={12} md={6} lg={4}>
                                    <div className="menu-producto-item" onClick={() => setSelectedProduct(producto)}>
                                        <div className="menu-producto-info">
                                            <h5 className="menu-producto-nombre">{producto.nombre}</h5>
                                            {producto.descripcion && (
                                                <p className="menu-producto-desc">{producto.descripcion}</p>
                                            )}
                                            <div className="menu-producto-precio">
                                                Bs {parseFloat(producto.precio).toFixed(0)}
                                            </div>
                                        </div>
                                        <div className="menu-producto-img-wrapper">
                                            {producto.imagePaths && producto.imagePaths.length > 0 ? (
                                                <img src={producto.imagePaths[0]} alt={producto.nombre} className="menu-producto-img" loading="lazy" />
                                            ) : (
                                                <div className="menu-sin-imagen-small">
                                                    <span className="material-symbols-outlined text-muted" style={{ fontSize: '1.5rem', opacity: 0.5 }}>image_not_supported</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            )}

            {/* Premium Product Detail Modal */}
            <Modal
                show={!!selectedProduct}
                onHide={() => setSelectedProduct(null)}
                dialogClassName="custom-menu-modal"
                centered
            >
                {selectedProduct && (
                    <>
                        <div className="menu-modal-header-img">
                            <button className="menu-modal-close-btn" onClick={() => setSelectedProduct(null)} aria-label="Cerrar">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            
                            {selectedProduct.imagePaths && selectedProduct.imagePaths.length > 0 ? (
                                <Carousel interval={4000} indicators={selectedProduct.imagePaths.length > 1} controls={selectedProduct.imagePaths.length > 1}>
                                    {selectedProduct.imagePaths.map((src, idx) => (
                                        <Carousel.Item key={idx}>
                                            <img
                                                className="d-block w-100"
                                                src={src}
                                                alt={`${selectedProduct.nombre} - ${idx + 1}`}
                                                style={{ height: '30vh', minHeight: '280px', objectFit: 'cover' }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ minHeight: '280px' }}>
                                    <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: '3.5rem', color: '#ccc' }}>image_not_supported</span>
                                    <span className="text-muted font-weight-bold">Sin imágenes</span>
                                </div>
                            )}
                        </div>

                        <div className="menu-detail-body">
                            <span className="menu-detail-categoria-badge">
                                {selectedProduct.categoria?.nombre || 'Sin categoría'}
                            </span>
                            
                            <div className="menu-detail-title-row">
                                <h3 className="menu-detail-title">{selectedProduct.nombre}</h3>
                                <div className="menu-detail-precio">
                                    Bs {parseFloat(selectedProduct.precio).toFixed(0)}
                                </div>
                            </div>
                            
                            {selectedProduct.descripcion ? (
                                <div className="menu-detail-descripcion">
                                    {selectedProduct.descripcion}
                                </div>
                            ) : (
                                <p className="text-muted fst-italic mb-4">Sin descripción disponible.</p>
                            )}

                            <div className="d-flex align-items-center mt-2">
                                <span className="badge bg-success bg-opacity-10 text-success d-flex align-items-center gap-1 py-2 px-3" style={{ borderRadius: '8px', border: '1px solid rgba(25, 135, 84, 0.2)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>check_circle</span>
                                    Disponible en menú
                                </span>
                            </div>
                        </div>

                        {!token && (
                            <div className="menu-modal-footer">
                                <Link to="/login" className="w-100" style={{ textDecoration: 'none' }}>
                                    <button className="menu-modal-login-btn">
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>login</span>
                                        Iniciar sesión para pedir
                                    </button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default MenuPublico;

