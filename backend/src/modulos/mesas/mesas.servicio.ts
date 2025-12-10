import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa, EstadoMesa } from './entidades/mesa.entidad';
import { CrearMesaDto, ActualizarMesaDto } from './dto';

@Injectable()
export class MesasServicio {
    constructor(
        @InjectRepository(Mesa)
        private mesaRepositorio: Repository<Mesa>,
    ) { }

    async obtenerTodas(estado?: EstadoMesa) {
        const consulta: any = { activo: true };
        if (estado) {
            consulta.estado = estado;
        }
        return this.mesaRepositorio.find({ where: consulta });
    }

    async obtenerPorId(id: number) {
        const mesa = await this.mesaRepositorio.findOne({
            where: { mesa_id: id },
        });
        if (!mesa) {
            throw new NotFoundException('Mesa no encontrada');
        }
        return mesa;
    }

    async crear(crearMesaDto: CrearMesaDto) {
        return this.mesaRepositorio.save(crearMesaDto);
    }

    async actualizar(id: number, actualizarMesaDto: ActualizarMesaDto) {
        const mesa = await this.obtenerPorId(id);
        Object.assign(mesa, actualizarMesaDto);
        return this.mesaRepositorio.save(mesa);
    }

    async actualizarEstado(id: number, estado: EstadoMesa) {
        const mesa = await this.obtenerPorId(id);
        mesa.estado = estado;
        return this.mesaRepositorio.save(mesa);
    }

    async eliminar(id: number) {
        const mesa = await this.obtenerPorId(id);
        mesa.activo = false;
        return this.mesaRepositorio.save(mesa);
    }

    async obtenerResumen() {
        const mesas = await this.mesaRepositorio.find({ where: { activo: true } });
        return {
            total: mesas.length,
            libre: mesas.filter(m => m.estado === EstadoMesa.LIBRE).length,
            ocupada: mesas.filter(m => m.estado === EstadoMesa.OCUPADA).length,
            reservada: mesas.filter(m => m.estado === EstadoMesa.RESERVADA).length,
        };
    }
}
