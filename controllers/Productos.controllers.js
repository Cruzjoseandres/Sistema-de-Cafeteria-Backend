const db = require("../models");

exports.createProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoriaId } = req.body;

  if (!nombre || !descripcion || !precio || !categoriaId) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const categoriaExiste = await db.categoriaProducto.findByPk(categoriaId);
    if (!categoriaExiste) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const nuevoProducto = await db.producto.create({
      nombre,
      descripcion,
      precio,
      estado: true,
      categoriaId,
    });

    const productoConCategoria = await db.producto.findByPk(nuevoProducto.id, {
      include: [
        {
          model: db.categoriaProducto,
          as: "categoria",
          attributes: ["descripcion"],
        },
      ],
    });

    res.status(201).json(productoConCategoria);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await db.producto.findAll({
      include: [
        {
          model: db.categoriaProducto,
          as: "categoria",
          attributes: ["id", "descripcion"],
        },
      ],
    });
    if (productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

exports.updateProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoriaId } = req.body;
  const { id } = req.params;

  if (!nombre || !descripcion || !precio || !categoriaId) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const producto = await db.producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const categoriaExiste = await db.categoriaProducto.findByPk(categoriaId);
    if (!categoriaExiste) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.categoriaId = categoriaId;
    await producto.save();

    const productoActualizado = await db.producto.findByPk(id, {
      include: [
        {
          model: db.categoriaProducto,
          as: "categoria",
          attributes: ["descripcion"],
        },
      ],
    });

    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

exports.estadoProducto = async (req, res) => {
  const { activo } = req.body;
  const { id } = req.params;

  if (activo === undefined) {
    return res.status(400).json({ error: "El estado es obligatorio" });
  }

  try {
    const producto = await db.producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    producto.estado = activo;
    await producto.save();

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al actualizar estado de producto:", error);
    res.status(500).json({ error: "Error al actualizar estado de producto" });
  }
};

exports.deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await db.producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.destroy();
    res.status(204).json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

exports.getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await db.producto.findByPk(id, {
      include: [
        {
          model: db.categoriaProducto,
          as: "categoria",
          attributes: ["descripcion"],
        },
      ],
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};
