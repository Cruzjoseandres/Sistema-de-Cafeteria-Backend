import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CuentasServicio } from './cuentas.servicio';
import { CrearCuentaDto, AgregarItemDto, PagarCuentaDto } from './dto';
import { UsuarioActual, Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';
import type { DatosUsuarioActual } from '../../comun/decoradores';

@ApiTags('Cuentas')
@ApiBearerAuth()
@Controller('pedidos/:pedidoId/cuentas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CuentasControlador {
    constructor(private readonly cuentasServicio: CuentasServicio) { }

    @Get()
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener cuentas de un pedido' })
    obtenerPorPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number) {
        return this.cuentasServicio.obtenerPorPedido(pedidoId);
    }

    @Get(':id')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener cuenta por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.cuentasServicio.obtenerPorId(id);
    }

    @Post()
    @Roles('Empleado')
    @ApiOperation({ summary: 'Crear nueva cuenta para cliente' })
    crear(
        @Param('pedidoId', ParseIntPipe) pedidoId: number,
        @Body() crearCuentaDto: CrearCuentaDto,
    ) {
        return this.cuentasServicio.crear(pedidoId, crearCuentaDto);
    }

    @Post(':id/items')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Agregar producto a cuenta' })
    agregarItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() agregarItemDto: AgregarItemDto,
    ) {
        return this.cuentasServicio.agregarItem(id, agregarItemDto);
    }

    @Delete(':id/items/:detalleId')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Eliminar producto de cuenta' })
    eliminarItem(
        @Param('id', ParseIntPipe) id: number,
        @Param('detalleId', ParseIntPipe) detalleId: number,
    ) {
        return this.cuentasServicio.eliminarItem(id, detalleId);
    }

    @Put(':id/pagar')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Pagar cuenta' })
    pagar(
        @Param('id', ParseIntPipe) id: number,
        @Body() pagarCuentaDto: PagarCuentaDto,
        @UsuarioActual() usuario: DatosUsuarioActual,
    ) {
        return this.cuentasServicio.pagar(id, pagarCuentaDto, usuario.usuario_id);
    }

    @Put(':id/cancelar')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Cancelar cuenta' })
    cancelar(@Param('id', ParseIntPipe) id: number) {
        return this.cuentasServicio.cancelar(id);
    }
}
