import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Badge, Spinner, Alert, Row, Col, Form, Button, Modal, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMenuPublico, getCategoriasPublicas } from '../../../../services/PublicService';
import { getAccessToken } from '../../../../utils/TokenUtilities';
import './MenuPublico.css';

const ImageGallery = ({ imagePaths, nombre }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!imagePaths || imagePaths.length === 0) {
        return (
            <div className="menu-producto-imagenes d-flex align-items-center justify-content-center bg-light">
                <span className="text-muted">Sin imagen</span>
            </div>
        );
    }

    if (imagePaths.length === 1) {
        return (
            <div className="menu-producto-imagenes">
                <img src={imagePaths[0]} alt={nombre} />
            </div>
        );
    }

    return (
        <div className="menu-producto-imagenes">
            <img src={imagePaths[currentIndex]} alt={`${nombre} ${currentIndex + 1}`} />
            <button
                className="menu-img-nav prev"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? imagePaths.length - 1 : prev - 1)); }}
            >‹</button>
            <button
                className="menu-img-nav next"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === imagePaths.length - 1 ? 0 : prev + 1)); }}
            >›</button>
            <div className="menu-img-indicators">
                {imagePaths.map((_, idx) => (
                    <span
                        key={idx}
                        className={`menu-img-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                    />
                ))}
            </div>
        </div>
    );
};

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

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredProductos = categoriaFilter
        ? productos.filter(p => p.categoria?.id === parseInt(categoriaFilter))
        : productos;

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
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
        <Container className="mt-4">
            <div className="menu-publico-header fade-in">
                <h1 className="d-flex justify-content-center align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2.5rem' }}>coffee</span>
                    Nuestro Menú
                </h1>
                <p>Descubre lo que tenemos preparado para ti hoy</p>
            </div>

            {!token && (
                <div className="menu-login-banner">
                    <p>¿Deseas realizar un pedido? Inicia sesión para acceder a todas las funciones.</p>
                    <Link to="/login">
                        <Button variant="primary" size="sm">Iniciar Sesión</Button>
                    </Link>
                </div>
            )}

            <div className="d-flex justify-content-end mb-4 fade-in">
                <div className="d-flex align-items-center bg-white border rounded-3 px-3 py-1 shadow-sm">
                    <span className="material-symbols-outlined text-muted-custom me-2">filter_list</span>
                    <Form.Select
                        className="border-0 shadow-none bg-transparent"
                        style={{ width: '250px' }}
                        value={categoriaFilter}
                        onChange={(e) => setCategoriaFilter(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            <Row>
                {filteredProductos.map((producto) => (
                    <Col key={producto.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card
                            className="menu-producto-card h-100"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedProduct(producto)}
                        >
                            <ImageGallery imagePaths={producto.imagePaths} nombre={producto.nombre} />
                            <Card.Body className="d-flex flex-column">
                                <span className="menu-producto-categoria mb-2">
                                    {producto.categoria?.nombre || 'Sin categoría'}
                                </span>
                                <h5 className="mb-1">{producto.nombre}</h5>
                                {producto.descripcion && (
                                    <p className="menu-producto-desc">{producto.descripcion}</p>
                                )}
                                <div className="menu-producto-precio">
                                    Bs. {parseFloat(producto.precio).toFixed(2)}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredProductos.length === 0 && (
                <Alert variant="warning" className="text-center fade-in d-flex flex-column align-items-center py-5">
                    <span className="material-symbols-outlined mb-2" style={{ fontSize: '3rem', color: 'var(--warning-color)' }}>search_off</span>
                    <h5>No hay productos disponibles</h5>
                    <p className="mb-0 text-muted-custom">Prueba seleccionando otra categoría</p>
                </Alert>
            )}

            {/* ========== MODAL DETALLE DEL PRODUCTO ========== */}
            <Modal
                show={!!selectedProduct}
                onHide={() => setSelectedProduct(null)}
                size="lg"
                centered
            >
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedProduct.nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Carousel de imágenes */}
                            {selectedProduct.imagePaths && selectedProduct.imagePaths.length > 0 ? (
                                <Carousel className="menu-detail-carousel mb-4" interval={3000}>
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
                                <div className="text-center p-5 bg-light rounded mb-4">
                                    <span className="text-muted" style={{ fontSize: '1.2rem' }}>Sin imágenes disponibles</span>
                                </div>
                            )}

                            {/* Detalles del producto */}
                            <div className="menu-detail-info">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <Badge bg="primary" className="mb-2">
                                            {selectedProduct.categoria?.nombre || 'Sin categoría'}
                                        </Badge>
                                        <h3 className="mb-1">{selectedProduct.nombre}</h3>
                                    </div>
                                    <div className="menu-detail-precio">
                                        Bs. {parseFloat(selectedProduct.precio).toFixed(2)}
                                    </div>
                                </div>

                                {selectedProduct.descripcion ? (
                                    <div className="menu-detail-descripcion">
                                        <h6 className="text-muted mb-2">📝 Descripción</h6>
                                        <p>{selectedProduct.descripcion}</p>
                                    </div>
                                ) : (
                                    <p className="text-muted fst-italic">Sin descripción disponible</p>
                                )}

                                <div className="d-flex align-items-center mt-4 pt-3 border-top">
                                    <Badge bg="success" className="me-3 d-flex align-items-center gap-1 py-2 px-3">
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>check_circle</span>
                                        Disponible
                                    </Badge>
                                    {selectedProduct.imagePaths && selectedProduct.imagePaths.length > 1 && (
                                        <small className="text-muted-custom d-flex align-items-center gap-1 font-weight-bold">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>photo_library</span>
                                            {selectedProduct.imagePaths.length} imágenes
                                        </small>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {!token && (
                                <Link to="/login">
                                    <Button variant="primary" size="sm">
                                        Iniciar sesión para pedir
                                    </Button>
                                </Link>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default MenuPublico;
