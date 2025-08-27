const express = require ('express');
const router = express.Router();
const RolController = require ('../controllers/Rol.controller');

router.post("/createRol", RolController.createRol);
router.get("/allRoles", RolController.getAllRoles);
router.put("/update/:id", RolController.updateRol);
router.delete("/delete/:id", RolController.deleteRol);

module.exports = router;