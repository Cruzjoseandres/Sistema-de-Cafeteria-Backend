import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosControlador } from './pedidos.controlador';
import { PedidosServicio } from './pedidos.servicio';
import { Pedido } from './entidades/pedido.entidad';
import { Mesa } from '../mesas/entidades/mesa.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Pedido, Mesa])],
    controllers: [PedidosControlador],
    providers: [PedidosServicio],
    exports: [PedidosServicio],
})
export class PedidosModulo { }
