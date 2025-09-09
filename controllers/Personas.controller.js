const db = require("../models");

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




