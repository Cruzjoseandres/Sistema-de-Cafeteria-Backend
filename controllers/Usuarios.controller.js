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


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const user = await db.usuario.findOne({
     include :[
      {
        model: db.persona,
        as: 'persona',
         where: { email },
        attributes: ['nombre', 'apellido', 'email', 'password']
      },
      {
        model: db.rol,
        as: 'rol',
        attributes: ['rol_id', 'descripcion']
      }
     ]
        
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas 1" });
    }

    if(password !== user.persona.password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const userResponse = user.toJSON();
    delete userResponse.password;

    //const token = jwt.sign({ id: user.usuario_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json( userResponse );
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}


exports.getUserById = async (req, res) => {
  const { id } = req.params;

  if(id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const user = await db.usuario.findOne({
      where: { usuario_id: id },
      include: [
        {
          model: db.persona,
          as: 'persona',
          attributes: ['nombre', 'apellido', 'email']
        },
        {
          model: db.rol,
          as: 'rol',
          attributes: ['descripcion']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

exports.createUser = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const contrasenaValida = esContrasenaSegura(password);

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!esEmailValido(email)) {
    return res.status(400).json({ error: "El email no es válido" });
  }


  if (contrasenaValida !== true) {
    return res.status(400).json({ error: contrasenaValida });
  }

  try {
    const userExistente = await db.persona.findOne({
      where: { email },
    });

    if (userExistente) {
      return res.status(409).json({ error: "Este email ya está en uso, por favor crea uno nuevo" });
    }

    const rolCliente = await db.rol.findOne({
      where: { descripcion : "Cliente" },
    });

    if (!rolCliente) {
      return res.status(409).json({ error: "Rol de cliente no encontrado" });
    }

    const newPersona = await db.persona.create({
      nombre,
      apellido,
      email,
      password,
    });

    await db.usuario.create({
      persona_id: newPersona.persona_id,
      rol_id: rolCliente.rol_id,
    });

    const personaObj = newPersona.toJSON();
    delete personaObj.password;
    res.status(201).json(personaObj);
  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ error: "Error al crear persona" });
  }
};



exports.createEmployee = async (req, res) => {
  const { nombre, apellido, email, password, rol_descripcion } = req.body;
  if (!nombre || !apellido || !email || !password || !rol_descripcion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!['Empleado'].includes(rol_descripcion)) {
    return res.status(400).json({ error: "Rol no válido para empleados" });
  }

  if (!esEmailValido(email)) {
    return res.status(400).json({ error: "El email no es válido" });
  }

  const contrasenaValida = esContrasenaSegura(password);
  if (contrasenaValida !== true) {
    return res.status(400).json({ error: contrasenaValida });
  }

  try {
    const userExistente = await db.persona.findOne({
      where: { email },
    });

    if (userExistente) {
      return res.status(409).json({ error: "Este email ya está en uso, por favor crea uno nuevo" });
    }

    const rol = await db.rol.findOne({
      where: { descripcion: rol_descripcion }
    });

    
    const newPersona = await db.persona.create({
      nombre,
      apellido,
      email,
      password,
    });

    await db.usuario.create({
      persona_id: newPersona.persona_id,
      rol_id: rol.rol_id,
    });

    const personaObj = newPersona.toJSON();
    delete personaObj.password;
    res.status(201).json(personaObj);
  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ error: "Error al crear persona" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.usuario.findAll({
      include: [
        {
          model: db.persona,
          as: 'persona',
          attributes: ['persona_id', 'nombre', 'apellido', 'email', 'fecha_creacion']
        },
        {
          model: db.rol,
          as: 'rol',
          attributes: ['rol_id', 'descripcion']
        }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.updateUser = async (req, res) => { 
  const {nombre, apellido, email, password} = req.body;
  const { id } = req.params;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!esEmailValido(email)) {
    return res.status(400).json({ error: "El email no es válido" });
  }

  const contrasenaValida = esContrasenaSegura(password);
  if (contrasenaValida !== true) {
    return res.status(400).json({ error: contrasenaValida });
  }

  try {
    const user = await db.usuario.findOne(
        {
            where: {  usuario_id:id },
            include: [
            {
                model: db.persona,
                as: 'persona',
                attributes: ['persona_id', 'nombre', 'apellido', 'email', 'password']
            }
        ]
        }
    );
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.persona.nombre = nombre;
    user.persona.apellido = apellido;
    user.persona.email = email;
    user.persona.password = password;

    await user.persona.save();
    const personaObj = user.persona.toJSON();
    delete personaObj.password;
    res.status(200).json(personaObj);
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    res.status(500).json({ error: "Error al actualizar persona" });
  }
}
