const db = require ( "../models" )

exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await db.categoriaProducto.findAll();
    if (categorias.length === 0) {
      return res.status(404).json({ error: "No se encontraron categorías" });
    }
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

exports.createCategoria = async (req, res) => {
  const { descripcion } = req.body;

  if (!descripcion) {
    return res.status(400).json({ error: "La descripción es obligatoria" });
  }

  try {
    const nuevaCategoria = await db.categoriaProducto.create({ descripcion });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};


exports.updateCategoria = async (req, res) => {
    const {descripcion} = req.body;
    const { id } = req.params;

    if (!descripcion) {
        return res.status(400).json({ error: "La descripción es obligatoria" });
    }

    try {
        const categoria = await db.categoriaProducto.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        categoria.descripcion = descripcion;
        await categoria.save();

        res.status(200).json(categoria);
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        res.status(500).json({ error: "Error al actualizar categoría" });
    }
};

exports.deleteCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const categoria = await db.categoriaProducto.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        await categoria.destroy();
        res.status(404).json({ message: "Categoría eliminada" });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({ error: "Error al eliminar categoría" });
    }
};
