import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaccion } from './entidades/transaccion.entidad';
import { DetalleCuenta } from '../cuentas/entidades/detalle-cuenta.entidad';

@Injectable()
export class ReportesServicio {
    constructor(
        @InjectRepository(Transaccion)
        private transaccionRepositorio: Repository<Transaccion>,
        @InjectRepository(DetalleCuenta)
        private detalleRepositorio: Repository<DetalleCuenta>,
    ) { }

    async obtenerVentasEmpleado(empleadoId: number, periodo: 'dia' | 'semana' | 'mes' | 'anio') {
        const { fechaInicio, fechaFin } = this.obtenerRangoFechas(periodo);

        const transacciones = await this.transaccionRepositorio.find({
            where: {
                empleado_id: empleadoId,
                fecha: Between(fechaInicio, fechaFin),
            },
            relations: ['cuenta', 'cuenta.pedido'],
        });

        const totalVentas = transacciones.reduce((suma, t) => suma + Number(t.monto), 0);
        const cantidadTransacciones = transacciones.length;

        return {
            periodo,
            empleado_id: empleadoId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            total_ventas: totalVentas,
            cantidad_transacciones: cantidadTransacciones,
            transacciones,
        };
    }

    async obtenerTodasLasVentas(periodo: 'dia' | 'semana' | 'mes' | 'anio') {
        const { fechaInicio, fechaFin } = this.obtenerRangoFechas(periodo);

        const transacciones = await this.transaccionRepositorio.find({
            where: {
                fecha: Between(fechaInicio, fechaFin),
            },
            relations: ['cuenta', 'empleado', 'empleado.persona'],
        });

        const totalVentas = transacciones.reduce((suma, t) => suma + Number(t.monto), 0);

        // Agrupar por empleado
        const ventasPorEmpleado = transacciones.reduce((acc: any, t) => {
            const id = t.empleado_id;
            if (!acc[id]) {
                acc[id] = {
                    empleado_id: id,
                    nombre: t.empleado?.persona?.nombre || 'Sin nombre',
                    apellido: t.empleado?.persona?.apellido || '',
                    total: 0,
                    cantidad: 0,
                };
            }
            acc[id].total += Number(t.monto);
            acc[id].cantidad += 1;
            return acc;
        }, {});

        return {
            periodo,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            total_ventas: totalVentas,
            cantidad_transacciones: transacciones.length,
            ventas_por_empleado: Object.values(ventasPorEmpleado),
        };
    }

    async obtenerProductosTop(periodo: 'dia' | 'semana' | 'mes' | 'anio', limite: number = 10) {
        const { fechaInicio, fechaFin } = this.obtenerRangoFechas(periodo);

        const resultado = await this.detalleRepositorio
            .createQueryBuilder('detalle')
            .select('detalle.producto_id', 'producto_id')
            .addSelect('producto.nombre', 'nombre')
            .addSelect('SUM(detalle.cantidad)', 'cantidad_vendida')
            .addSelect('SUM(detalle.subtotal)', 'total_vendido')
            .innerJoin('detalle.producto', 'producto')
            .innerJoin('detalle.cuenta', 'cuenta')
            .where('cuenta.fecha_pago BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .andWhere('cuenta.estado = :estado', { estado: 'pagada' })
            .groupBy('detalle.producto_id')
            .addGroupBy('producto.nombre')
            .orderBy('cantidad_vendida', 'DESC')
            .limit(limite)
            .getRawMany();

        return {
            periodo,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            productos_top: resultado,
        };
    }

    private obtenerRangoFechas(periodo: 'dia' | 'semana' | 'mes' | 'anio') {
        const fechaFin = new Date();
        const fechaInicio = new Date();

        switch (periodo) {
            case 'dia':
                fechaInicio.setHours(0, 0, 0, 0);
                break;
            case 'semana':
                fechaInicio.setDate(fechaInicio.getDate() - 7);
                break;
            case 'mes':
                fechaInicio.setMonth(fechaInicio.getMonth() - 1);
                break;
            case 'anio':
                fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
                break;
        }

        return { fechaInicio, fechaFin };
    }
}
