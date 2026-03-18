import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { Pedido } from './entities/pedido.entity';
import { Cuenta } from '../cuenta/entities/cuenta.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Cuenta, DetallePedido])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule { }
