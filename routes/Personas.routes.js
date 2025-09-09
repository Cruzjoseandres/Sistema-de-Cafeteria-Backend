const express = require ('express');
const router = express.Router();
const PersonasController = require ('../controllers/Personas.controller');


router.get("/", PersonasController.getAllPersonas);


module.exports = router;
