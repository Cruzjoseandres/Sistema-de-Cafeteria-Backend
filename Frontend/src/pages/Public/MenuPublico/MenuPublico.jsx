import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Spinner, Alert, Row, Col, Modal, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMenuPublico, getCategoriasPublicas } from '../../../../services/PublicService';
import { getAccessToken } from '../../../../utils/TokenUtilities';
import './MenuPublico.css';

/* ---------- Image Gallery in card ---------- */
const ImageGallery = ({ imagePaths, nombre }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!imagePaths || imagePaths.length === 0) {
        return (
            <div className="menu-producto-imagenes">
                <div className="menu-sin-imagen">
                    <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#ccc' }}>image_not_supported</span>
                    Sin imagen
                </div>
            </div>
        );
    }

    const prev = (e) => {
        e.stopPropagation();
        setCurrentIndex(i => (i === 0 ? imagePaths.length - 1 : i - 1));
    };
    const next = (e) => {
        e.stopPropagation();
        setCurrentIndex(i => (i === imagePaths.length - 1 ? 0 : i + 1));
    };

    return (
        <div className="menu-producto-imagenes">
            <img src={imagePaths[currentIndex]} alt={`${nombre} ${currentIndex + 1}`} loading="lazy" />
            {imagePaths.length > 1 && (
                <>
                    <button className="menu-img-nav prev" onClick={prev} aria-label="Anterior">‹</button>
                    <button className="menu-img-nav next" onClick={next} aria-label="Siguiente">›</button>
                    <div className="menu-img-indicators">
                        {imagePaths.map((_, idx) => (
                            <span
                                key={idx}
                                className={`menu-img-dot ${idx === currentIndex ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

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
                        <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.1rem' }}>login</span>
                        Inicia sesión para hacer un pedido
                    </p>
                    <Link to="/login">
                        <button className="btn btn-primary btn-sm px-3" style={{ borderRadius: '8px' }}>
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
                <Alert variant="warning" className="text-center py-5 fade-in">
                    <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: '3rem' }}>search_off</span>
                    <h5>No hay productos disponibles</h5>
                    <p className="mb-0 text-muted">Prueba seleccionando otra categoría</p>
                </Alert>
            ) : (
                Object.entries(grouped).map(([categoria, prods]) => (
                    <div key={categoria} className="mb-5 fade-in">
                        <h2 className="menu-categoria-titulo">{categoria}</h2>
                        <Row className="g-3">
                            {prods.map((producto) => (
                                <Col key={producto.id} xs={6} sm={6} md={4} lg={3}>
                                    <Card
                                        className="menu-producto-card"
                                        onClick={() => setSelectedProduct(producto)}
                                    >
                                        <ImageGallery imagePaths={producto.imagePaths} nombre={producto.nombre} />
                                        <Card.Body className="d-flex flex-column p-2 p-sm-3">
                                            <h5 className="menu-producto-nombre">{producto.nombre}</h5>
                                            {producto.descripcion && (
                                                <p className="menu-producto-desc">{producto.descripcion}</p>
                                            )}
                                            <div className="menu-producto-precio mt-auto">
                                                Bs. {parseFloat(producto.precio).toFixed(2)}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            )}

            {/* Product Detail Modal */}
            <Modal
                show={!!selectedProduct}
                onHide={() => setSelectedProduct(null)}
                size="lg"
                centered
            >
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                {selectedProduct.nombre}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Image carousel */}
                            {selectedProduct.imagePaths && selectedProduct.imagePaths.length > 0 ? (
                                <Carousel className="menu-detail-carousel mb-3" interval={3000} indicators={selectedProduct.imagePaths.length > 1}>
                                    {selectedProduct.imagePaths.map((src, idx) => (
                                        <Carousel.Item key={idx}>
                                            <img
                                                className="d-block w-100 menu-detail-carousel-img"
                                                src={src}
                                                alt={`${selectedProduct.nombre} - ${idx + 1}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="text-center p-5 bg-light rounded mb-3">
                                    <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: '3rem', color: '#ccc' }}>image_not_supported</span>
                                    <span className="text-muted">Sin imágenes disponibles</span>
                                </div>
                            )}

                            {/* Product detail */}
                            <div className="menu-detail-info">
                                <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
                                    <div>
                                        <span className="badge bg-primary mb-2" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                                            {selectedProduct.categoria?.nombre || 'Sin categoría'}
                                        </span>
                                        <h4 className="mb-0" style={{ fontWeight: 700 }}>{selectedProduct.nombre}</h4>
                                    </div>
                                    <div className="menu-detail-precio flex-shrink-0">
                                        Bs. {parseFloat(selectedProduct.precio).toFixed(2)}
                                    </div>
                                </div>

                                {selectedProduct.descripcion ? (
                                    <div className="menu-detail-descripcion">
                                        <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descripción</h6>
                                        <p>{selectedProduct.descripcion}</p>
                                    </div>
                                ) : (
                                    <p className="text-muted fst-italic">Sin descripción disponible</p>
                                )}

                                <div className="d-flex align-items-center mt-3 pt-3 border-top gap-3">
                                    <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3" style={{ borderRadius: '8px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
                                        Disponible
                                    </span>
                                    {!token && (
                                        <Link to="/login">
                                            <button className="btn btn-primary btn-sm px-3" style={{ borderRadius: '8px' }}>
                                                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>login</span>
                                                Iniciar sesión para pedir
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedProduct(null)}>Cerrar</button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default MenuPublico;
