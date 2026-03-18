import { Container, Card, Badge, Spinner, Alert, Row, Col, Form } from 'react-bootstrap';
import { useMeseroProductos } from './useMeseroProductos';
import './MeseroProductos.css';

const MeseroProductos = () => {
    const { productos, categorias, categoriaFilter, setCategoriaFilter, loading, error } = useMeseroProductos();

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
            <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
                <h1 className="d-flex align-items-center gap-2 mb-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2.5rem' }}>menu_book</span>
                    Menú
                </h1>

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
                {productos.map((producto) => (
                    <Col key={producto.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="producto-card h-100">
                            {producto.imagePaths && producto.imagePaths.length > 0 && (
                                <Card.Img
                                    variant="top"
                                    src={producto.imagePaths[0]}
                                    alt={producto.nombre}
                                    className="producto-card-img"
                                />
                            )}
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="mb-0">{producto.nombre}</h5>
                                    <Badge bg={producto.disponible ? 'success' : 'secondary'}>
                                        {producto.disponible ? (
                                            <span className="d-flex align-items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span> Disponible</span>
                                        ) : (
                                            <span className="d-flex align-items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>cancel</span> Agotado</span>
                                        )}
                                    </Badge>
                                </div>
                                <span className="producto-categoria mb-2">
                                    {producto.categoria?.nombre || 'Sin categoría'}
                                </span>
                                {producto.descripcion && (
                                    <p className="producto-desc">{producto.descripcion}</p>
                                )}
                                <div className="producto-precio">
                                    ${parseFloat(producto.precio).toFixed(2)}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {productos.length === 0 && (
                <Alert variant="warning" className="text-center fade-in d-flex flex-column align-items-center py-5">
                    <span className="material-symbols-outlined mb-2" style={{ fontSize: '3rem', color: 'var(--warning-color)' }}>search_off</span>
                    <h5>No hay productos disponibles</h5>
                    <p className="mb-0 text-muted-custom">Prueba seleccionando otra categoría</p>
                </Alert>
            )}
        </Container>
    );
};

export default MeseroProductos;
