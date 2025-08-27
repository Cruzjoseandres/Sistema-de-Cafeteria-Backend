const db = require("../models");


exports.createRol = async (req, res) => {
    const { descripcion } = req.body;

    if (!descripcion) {
        return res.status(400).json({ error: "La descripción del rol es obligatoria" });
    }

    try {
        const nuevoRol = await db.rol.create({ descripcion });
        res.status(201).json(nuevoRol);
    } catch (error) {
        console.error("Error al crear rol:", error);
        res.status(500).json({ error: "Error al crear rol" });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await db.rol.findAll();
        if (roles.length === 0) {
            return res.status(404).json({ message: "No se encontraron roles" });
        }
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error al obtener roles:", error);
        res.status(500).json({ error: "Error al obtener roles" });
    }
};


exports.updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        if (!id) {
            return res.status(400).json({ error: "El ID del rol es obligatorio" });
        }

        if (!descripcion) {
            return res.status(400).json({ error: "La descripción del rol es obligatoria" });
        }

        const rol = await db.rol.findByPk(id);

        if (!rol) {
            return res.status(404).json({ error: "Rol no encontrado" });
        }

        rol.descripcion = descripcion;
        await rol.save();

        res.status(200).json(rol);
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        res.status(500).json({ error: "Error al actualizar rol" });
    }
};

exports.deleteRol = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "El ID del rol es obligatorio" });
        }

        const rol = await db.rol.findByPk(id);

        if (!rol) {
            return res.status(404).json({ error: "Rol no encontrado" });
        }

        await rol.destroy();
        res.status(200).json({ message: "Rol eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        res.status(500).json({ error: "Error al eliminar rol" });
    }
};



