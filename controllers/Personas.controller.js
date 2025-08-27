const db = require("../models");

function esEmailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function esContrasenaSegura(password) {
  if (password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres";
  return true;
}

exports.getAllPersonas = async (req, res) => {
  try {
    const personas = await db.persona.findAll();
    if (personas.length === 0) {
      return res.status(404).json({ error: "No se encontraron personas" });
    }
    res.status(200).json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ error: "Error al obtener personas" });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const persona = await db.persona.findByPk(id);
    if (!persona) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    await persona.destroy();
    res.status(200).json({ message: "Persona eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar persona:", error);
    res.status(500).json({ error: "Error al eliminar persona" });
  }
};



