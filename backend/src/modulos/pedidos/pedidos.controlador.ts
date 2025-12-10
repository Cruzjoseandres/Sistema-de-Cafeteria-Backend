import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PedidosServicio } from './pedidos.servicio';
import { CrearPedidoDto, ActualizarPedidoDto } from './dto';
import { EstadoPedido } from './entidades/pedido.entidad';
import { UsuarioActual, Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';
import type { DatosUsuarioActual } from '../../comun/decoradores';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PedidosControlador {
    constructor(private readonly pedidosServicio: PedidosServicio) { }

    @Get()
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener todos los pedidos' })
    @ApiQuery({ name: 'empleado', required: false, type: Number })
    @ApiQuery({ name: 'estado', required: false, enum: EstadoPedido })
    obtenerTodos(
        @Query('empleado') empleadoId?: number,
        @Query('estado') estado?: EstadoPedido,
    ) {
        return this.pedidosServicio.obtenerTodos(empleadoId, estado);
    }

    @Get('mis-pedidos')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Obtener mis pedidos (empleado)' })
    obtenerMisPedidos(@UsuarioActual() usuario: DatosUsuarioActual) {
        return this.pedidosServicio.obtenerTodos(usuario.usuario_id);
    }

    @Get(':id')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener pedido por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.pedidosServicio.obtenerPorId(id);
    }

    @Post()
    @Roles('Empleado')
    @ApiOperation({ summary: 'Crear nuevo pedido' })
    crear(
        @Body() crearPedidoDto: CrearPedidoDto,
        @UsuarioActual() usuario: DatosUsuarioActual,
    ) {
        return this.pedidosServicio.crear(crearPedidoDto, usuario.usuario_id);
    }

    @Put(':id')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Actualizar pedido' })
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarPedidoDto: ActualizarPedidoDto,
    ) {
        return this.pedidosServicio.actualizar(id, actualizarPedidoDto);
    }

    @Put(':id/cerrar')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Cerrar pedido (todas las cuentas pagadas)' })
    cerrar(@Param('id', ParseIntPipe) id: number) {
        return this.pedidosServicio.cerrar(id);
    }

    @Put(':id/cancelar')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Cancelar pedido' })
    cancelar(@Param('id', ParseIntPipe) id: number) {
        return this.pedidosServicio.cancelar(id);
    }
}
