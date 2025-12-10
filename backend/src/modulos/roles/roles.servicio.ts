import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entidades/rol.entidad';

@Injectable()
export class RolesServicio {
    constructor(
        @InjectRepository(Rol)
        private rolRepositorio: Repository<Rol>,
    ) { }

    async obtenerTodos() {
        return this.rolRepositorio.find();
    }

    async obtenerPorId(id: number) {
        const rol = await this.rolRepositorio.findOne({ where: { rol_id: id } });
        if (!rol) {
            throw new NotFoundException('Rol no encontrado');
        }
        return rol;
    }

    async crear(nombre: string, descripcion?: string) {
        return this.rolRepositorio.save({ nombre, descripcion });
    }

    async sembrarRolesPorDefecto() {
        const roles = ['Admin', 'Empleado', 'Cliente'];
        for (const nombre of roles) {
            const existe = await this.rolRepositorio.findOne({ where: { nombre } });
            if (!existe) {
                await this.rolRepositorio.save({ nombre, descripcion: `Rol de ${nombre.toLowerCase()}` });
            }
        }
        return this.obtenerTodos();
    }
}
