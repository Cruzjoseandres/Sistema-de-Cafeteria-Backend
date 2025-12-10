import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta, DetalleCuenta, EstadoCuenta } from './entidades';
import { Producto } from '../productos/entidades/producto.entidad';
import { Pedido } from '../pedidos/entidades/pedido.entidad';
import { Transaccion, MetodoPago } from '../reportes/entidades/transaccion.entidad';
import { CrearCuentaDto, AgregarItemDto, PagarCuentaDto } from './dto';

@Injectable()
export class CuentasServicio {
    constructor(
        @InjectRepository(Cuenta)
        private cuentaRepositorio: Repository<Cuenta>,
        @InjectRepository(DetalleCuenta)
        private detalleRepositorio: Repository<DetalleCuenta>,
        @InjectRepository(Producto)
        private productoRepositorio: Repository<Producto>,
        @InjectRepository(Pedido)
        private pedidoRepositorio: Repository<Pedido>,
        @InjectRepository(Transaccion)
        private transaccionRepositorio: Repository<Transaccion>,
    ) { }

    async obtenerPorPedido(pedidoId: number) {
        return this.cuentaRepositorio.find({
            where: { pedido_id: pedidoId },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    async obtenerPorId(id: number) {
        const cuenta = await this.cuentaRepositorio.findOne({
            where: { cuenta_id: id },
            relations: ['detalles', 'detalles.producto', 'pedido'],
        });
        if (!cuenta) {
            throw new NotFoundException('Cuenta no encontrada');
        }
        return cuenta;
    }

    async crear(pedidoId: number, crearCuentaDto: CrearCuentaDto) {
        const pedido = await this.pedidoRepositorio.findOne({
            where: { pedido_id: pedidoId },
        });
        if (!pedido) {
            throw new NotFoundException('Pedido no encontrado');
        }

        const cuenta = await this.cuentaRepositorio.save({
            pedido_id: pedidoId,
            ...crearCuentaDto,
        });

        return this.obtenerPorId(cuenta.cuenta_id);
    }

    async agregarItem(cuentaId: number, agregarItemDto: AgregarItemDto) {
        const cuenta = await this.obtenerPorId(cuentaId);
        if (cuenta.estado !== EstadoCuenta.PENDIENTE) {
            throw new BadRequestException('La cuenta ya está pagada o cancelada');
        }

        const producto = await this.productoRepositorio.findOne({
            where: { producto_id: agregarItemDto.producto_id },
        });
        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        const subtotal = Number(producto.precio) * agregarItemDto.cantidad;

        await this.detalleRepositorio.save({
            cuenta_id: cuentaId,
            producto_id: agregarItemDto.producto_id,
            cantidad: agregarItemDto.cantidad,
            precio_unitario: producto.precio,
            subtotal,
            notas: agregarItemDto.notas,
        });

        // Actualizar total de la cuenta
        await this.actualizarTotalCuenta(cuentaId);

        return this.obtenerPorId(cuentaId);
    }

    async eliminarItem(cuentaId: number, detalleId: number) {
        const cuenta = await this.obtenerPorId(cuentaId);
        if (cuenta.estado !== EstadoCuenta.PENDIENTE) {
            throw new BadRequestException('La cuenta ya está pagada o cancelada');
        }

        const detalle = await this.detalleRepositorio.findOne({
            where: { detalle_id: detalleId, cuenta_id: cuentaId },
        });
        if (!detalle) {
            throw new NotFoundException('Detalle no encontrado');
        }

        await this.detalleRepositorio.remove(detalle);
        await this.actualizarTotalCuenta(cuentaId);

        return this.obtenerPorId(cuentaId);
    }

    async pagar(cuentaId: number, pagarCuentaDto: PagarCuentaDto, empleadoId: number) {
        const cuenta = await this.obtenerPorId(cuentaId);
        if (cuenta.estado !== EstadoCuenta.PENDIENTE) {
            throw new BadRequestException('La cuenta ya está pagada o cancelada');
        }

        // Añadir propina si existe
        if (pagarCuentaDto.propina) {
            cuenta.propina = pagarCuentaDto.propina;
            cuenta.total = Number(cuenta.subtotal) + Number(pagarCuentaDto.propina);
        }

        cuenta.estado = EstadoCuenta.PAGADA;
        cuenta.fecha_pago = new Date();
        await this.cuentaRepositorio.save(cuenta);

        // Crear transacción
        await this.transaccionRepositorio.save({
            cuenta_id: cuentaId,
            empleado_id: empleadoId,
            monto: cuenta.total,
            metodo_pago: pagarCuentaDto.metodo_pago || MetodoPago.EFECTIVO,
            referencia: pagarCuentaDto.referencia,
        });

        return this.obtenerPorId(cuentaId);
    }

    async cancelar(cuentaId: number) {
        const cuenta = await this.obtenerPorId(cuentaId);
        if (cuenta.estado === EstadoCuenta.PAGADA) {
            throw new BadRequestException('No se puede cancelar una cuenta pagada');
        }

        cuenta.estado = EstadoCuenta.CANCELADA;
        await this.cuentaRepositorio.save(cuenta);

        return this.obtenerPorId(cuentaId);
    }

    private async actualizarTotalCuenta(cuentaId: number) {
        const cuenta = await this.cuentaRepositorio.findOne({
            where: { cuenta_id: cuentaId },
            relations: ['detalles'],
        });

        if (cuenta) {
            const subtotal = cuenta.detalles.reduce((suma, d) => suma + Number(d.subtotal), 0);
            cuenta.subtotal = subtotal;
            cuenta.total = subtotal + Number(cuenta.propina || 0);
            await this.cuentaRepositorio.save(cuenta);
        }
    }
}
