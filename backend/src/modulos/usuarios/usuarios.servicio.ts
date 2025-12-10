import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entidades/usuario.entidad';
import { Persona } from '../autenticacion/entidades/persona.entidad';
import { Rol } from '../roles/entidades/rol.entidad';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './dto';

@Injectable()
export class UsuariosServicio {
    constructor(
        @InjectRepository(Persona)
        private personaRepositorio: Repository<Persona>,
        @InjectRepository(Usuario)
        private usuarioRepositorio: Repository<Usuario>,
        @InjectRepository(Rol)
        private rolRepositorio: Repository<Rol>,
    ) { }

    async obtenerTodos() {
        return this.usuarioRepositorio.find({
            relations: ['persona', 'rol'],
            where: { activo: true },
        });
    }

    async obtenerPorId(id: number) {
        const usuario = await this.usuarioRepositorio.findOne({
            where: { usuario_id: id },
            relations: ['persona', 'rol'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async obtenerPorRol(nombreRol: string) {
        return this.usuarioRepositorio.find({
            relations: ['persona', 'rol'],
            where: {
                rol: { nombre: nombreRol },
                activo: true,
            },
        });
    }

    async crearEmpleado(crearUsuarioDto: CrearUsuarioDto) {
        const { nombre, apellido, email, telefono, password, rol_id } = crearUsuarioDto;

        // Verificar email único
        const emailExistente = await this.personaRepositorio.findOne({ where: { email } });
        if (emailExistente) {
            throw new ConflictException('El email ya está registrado');
        }

        // Verificar teléfono único si se proporciona
        if (telefono) {
            const telefonoExistente = await this.personaRepositorio.findOne({ where: { telefono } });
            if (telefonoExistente) {
                throw new ConflictException('El teléfono ya está registrado');
            }
        }

        // Verificar que el rol existe
        const rol = await this.rolRepositorio.findOne({ where: { rol_id } });
        if (!rol) {
            throw new NotFoundException('Rol no encontrado');
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Crear persona
        const persona = await this.personaRepositorio.save({
            nombre,
            apellido,
            email,
            telefono,
            password_hash,
        });

        // Crear usuario
        const usuario = await this.usuarioRepositorio.save({
            persona_id: persona.persona_id,
            rol_id,
        });

        return this.obtenerPorId(usuario.usuario_id);
    }

    async actualizar(id: number, actualizarUsuarioDto: ActualizarUsuarioDto) {
        const usuario = await this.obtenerPorId(id);

        if (actualizarUsuarioDto.email && actualizarUsuarioDto.email !== usuario.persona.email) {
            const emailExistente = await this.personaRepositorio.findOne({
                where: { email: actualizarUsuarioDto.email },
            });
            if (emailExistente) {
                throw new ConflictException('El email ya está registrado');
            }
        }

        if (actualizarUsuarioDto.password) {
            const password_hash = await bcrypt.hash(actualizarUsuarioDto.password, 10);
            const { password, ...datosActualizar } = actualizarUsuarioDto;
            await this.personaRepositorio.update(usuario.persona_id, {
                ...datosActualizar,
                password_hash,
            });
        } else {
            const { password, ...datosActualizar } = actualizarUsuarioDto;
            await this.personaRepositorio.update(usuario.persona_id, datosActualizar);
        }

        return this.obtenerPorId(id);
    }

    async eliminar(id: number) {
        const usuario = await this.obtenerPorId(id);
        await this.usuarioRepositorio.update(id, { activo: false });
        await this.personaRepositorio.update(usuario.persona_id, { activo: false });
        return { mensaje: 'Usuario desactivado exitosamente' };
    }
}
