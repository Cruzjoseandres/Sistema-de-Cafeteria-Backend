import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Persona } from './entidades/persona.entidad';
import { Usuario } from '../usuarios/entidades/usuario.entidad';
import { Rol } from '../roles/entidades/rol.entidad';
import { RegistrarDto, IniciarSesionDto } from './dto';

@Injectable()
export class AutenticacionServicio {
    constructor(
        @InjectRepository(Persona)
        private personaRepositorio: Repository<Persona>,
        @InjectRepository(Usuario)
        private usuarioRepositorio: Repository<Usuario>,
        @InjectRepository(Rol)
        private rolRepositorio: Repository<Rol>,
        private jwtService: JwtService,
    ) { }

    async registrar(registrarDto: RegistrarDto) {
        const { nombre, apellido, email, telefono, password } = registrarDto;

        // Verificar si el email ya existe
        const personaExistente = await this.personaRepositorio.findOne({
            where: { email },
        });

        if (personaExistente) {
            throw new ConflictException('Este email ya está registrado');
        }

        // Verificar si el teléfono ya existe
        if (telefono) {
            const telefonoExistente = await this.personaRepositorio.findOne({
                where: { telefono },
            });

            if (telefonoExistente) {
                throw new ConflictException('Este teléfono ya está registrado');
            }
        }

        // Obtener rol de Cliente
        let rolCliente = await this.rolRepositorio.findOne({
            where: { nombre: 'Cliente' },
        });

        // Si no existe, crearlo
        if (!rolCliente) {
            rolCliente = await this.rolRepositorio.save({
                nombre: 'Cliente',
                descripcion: 'Usuario cliente de la cafetería',
            });
        }

        // Hash de la contraseña
        const rondasSal = 10;
        const password_hash = await bcrypt.hash(password, rondasSal);

        // Crear persona
        const persona = await this.personaRepositorio.save({
            nombre,
            apellido,
            email,
            telefono,
            password_hash,
        });

        // Crear usuario con rol de cliente
        await this.usuarioRepositorio.save({
            persona_id: persona.persona_id,
            rol_id: rolCliente.rol_id,
        });

        return {
            mensaje: 'Usuario registrado exitosamente',
            persona_id: persona.persona_id,
            email: persona.email,
        };
    }

    async iniciarSesion(iniciarSesionDto: IniciarSesionDto) {
        const { email, password } = iniciarSesionDto;

        // Buscar usuario por email
        const usuario = await this.usuarioRepositorio.findOne({
            relations: ['persona', 'rol'],
            where: {
                persona: { email },
                activo: true,
            },
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.persona.password_hash);

        if (!passwordValido) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar JWT
        const payload = {
            sub: usuario.usuario_id,
            email: usuario.persona.email,
            rol: usuario.rol.nombre,
            rol_id: usuario.rol.rol_id,
        };

        const tokenAcceso = this.jwtService.sign(payload);

        return {
            token_acceso: tokenAcceso,
            usuario: {
                usuario_id: usuario.usuario_id,
                nombre: usuario.persona.nombre,
                apellido: usuario.persona.apellido,
                email: usuario.persona.email,
                telefono: usuario.persona.telefono,
                rol: usuario.rol.nombre,
            },
        };
    }

    async validarUsuario(payload: { sub: number; email: string; rol: string }) {
        const usuario = await this.usuarioRepositorio.findOne({
            relations: ['persona', 'rol'],
            where: { usuario_id: payload.sub, activo: true },
        });

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            usuario_id: usuario.usuario_id,
            email: usuario.persona.email,
            nombre: usuario.persona.nombre,
            apellido: usuario.persona.apellido,
            rol: usuario.rol.nombre,
            rol_id: usuario.rol.rol_id,
        };
    }
}
