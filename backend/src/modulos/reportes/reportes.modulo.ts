import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesControlador } from './reportes.controlador';
import { ReportesServicio } from './reportes.servicio';
import { Transaccion } from './entidades/transaccion.entidad';
import { DetalleCuenta } from '../cuentas/entidades/detalle-cuenta.entidad';
import { Producto } from '../productos/entidades/producto.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Transaccion, DetalleCuenta, Producto])],
    controllers: [ReportesControlador],
    providers: [ReportesServicio],
    exports: [ReportesServicio],
})
export class ReportesModulo { }
