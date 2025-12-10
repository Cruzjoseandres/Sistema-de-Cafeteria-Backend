import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido, EstadoPedido } from './entidades/pedido.entidad';
import { Mesa, EstadoMesa } from '../mesas/entidades/mesa.entidad';
import { CrearPedidoDto, ActualizarPedidoDto } from './dto';

@Injectable()
export class PedidosServicio {
    constructor(
        @InjectRepository(Pedido)
        private pedidoRepositorio: Repository<Pedido>,
        @InjectRepository(Mesa)
        private mesaRepositorio: Repository<Mesa>,
    ) { }

    async obtenerTodos(empleadoId?: number, estado?: EstadoPedido) {
        const consulta: any = {};
        if (empleadoId) consulta.empleado_id = empleadoId;
        if (estado) consulta.estado = estado;

        return this.pedidoRepositorio.find({
            where: consulta,
            relations: ['mesa', 'empleado', 'empleado.persona', 'cuentas'],
            order: { fecha_apertura: 'DESC' },
        });
    }

    async obtenerPorId(id: number) {
        const pedido = await this.pedidoRepositorio.findOne({
            where: { pedido_id: id },
            relations: ['mesa', 'empleado', 'empleado.persona', 'cuentas', 'cuentas.detalles', 'cuentas.detalles.producto'],
        });
        if (!pedido) {
            throw new NotFoundException('Pedido no encontrado');
        }
        return pedido;
    }

    async crear(crearPedidoDto: CrearPedidoDto, empleadoId: number) {
        const mesa = await this.mesaRepositorio.findOne({
            where: { mesa_id: crearPedidoDto.mesa_id },
        });
        if (!mesa) {
            throw new NotFoundException('Mesa no encontrada');
        }
        if (mesa.estado === EstadoMesa.OCUPADA) {
            throw new BadRequestException('La mesa ya está ocupada');
        }

        // Marcar mesa como ocupada
        mesa.estado = EstadoMesa.OCUPADA;
        await this.mesaRepositorio.save(mesa);

        // Crear pedido
        const pedido = await this.pedidoRepositorio.save({
            ...crearPedidoDto,
            empleado_id: empleadoId,
        });

        return this.obtenerPorId(pedido.pedido_id);
    }

    async actualizar(id: number, actualizarPedidoDto: ActualizarPedidoDto) {
        const pedido = await this.obtenerPorId(id);
        Object.assign(pedido, actualizarPedidoDto);
        return this.pedidoRepositorio.save(pedido);
    }

    async cerrar(id: number) {
        const pedido = await this.obtenerPorId(id);

        // Verificar que todas las cuentas estén pagadas
        const cuentasPendientes = pedido.cuentas?.filter(c => c.estado === 'pendiente') || [];
        if (cuentasPendientes.length > 0) {
            throw new BadRequestException('Hay cuentas pendientes de pago');
        }

        // Cerrar pedido
        pedido.estado = EstadoPedido.CERRADO;
        pedido.fecha_cierre = new Date();
        await this.pedidoRepositorio.save(pedido);

        // Liberar mesa
        const mesa = await this.mesaRepositorio.findOne({
            where: { mesa_id: pedido.mesa_id },
        });
        if (mesa) {
            mesa.estado = EstadoMesa.LIBRE;
            await this.mesaRepositorio.save(mesa);
        }

        return this.obtenerPorId(id);
    }

    async cancelar(id: number) {
        const pedido = await this.obtenerPorId(id);
        pedido.estado = EstadoPedido.CANCELADO;
        pedido.fecha_cierre = new Date();
        await this.pedidoRepositorio.save(pedido);

        // Liberar mesa
        const mesa = await this.mesaRepositorio.findOne({
            where: { mesa_id: pedido.mesa_id },
        });
        if (mesa) {
            mesa.estado = EstadoMesa.LIBRE;
            await this.mesaRepositorio.save(mesa);
        }

        return this.obtenerPorId(id);
    }
}
