const express = require ('express');
const router = express.Router();
const CategoriaProductoController = require ('../controllers/CategoriaProducto.controller');

router.get("/", CategoriaProductoController.getAllCategorias);
router.post("/", CategoriaProductoController.createCategoria);
router.put("/:id", CategoriaProductoController.updateCategoria);
router.delete("/:id", CategoriaProductoController.deleteCategoria);

module.exports = router;
