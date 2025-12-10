import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasControlador } from './cuentas.controlador';
import { CuentasServicio } from './cuentas.servicio';
import { Cuenta, DetalleCuenta } from './entidades';
import { Producto } from '../productos/entidades/producto.entidad';
import { Pedido } from '../pedidos/entidades/pedido.entidad';
import { Transaccion } from '../reportes/entidades/transaccion.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Cuenta, DetalleCuenta, Producto, Pedido, Transaccion])],
    controllers: [CuentasControlador],
    providers: [CuentasServicio],
    exports: [CuentasServicio],
})
export class CuentasModulo { }
