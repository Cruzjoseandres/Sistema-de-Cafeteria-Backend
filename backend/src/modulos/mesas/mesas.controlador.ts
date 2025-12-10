import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MesasServicio } from './mesas.servicio';
import { CrearMesaDto, ActualizarMesaDto } from './dto';
import { EstadoMesa } from './entidades/mesa.entidad';
import { Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';

@ApiTags('Mesas')
@ApiBearerAuth()
@Controller('mesas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MesasControlador {
    constructor(private readonly mesasServicio: MesasServicio) { }

    @Get()
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener todas las mesas' })
    @ApiQuery({ name: 'estado', required: false, enum: EstadoMesa })
    obtenerTodas(@Query('estado') estado?: EstadoMesa) {
        return this.mesasServicio.obtenerTodas(estado);
    }

    @Get('resumen')
    @Roles('Admin')
    @ApiOperation({ summary: 'Obtener resumen de mesas' })
    obtenerResumen() {
        return this.mesasServicio.obtenerResumen();
    }

    @Get(':id')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener mesa por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.mesasServicio.obtenerPorId(id);
    }

    @Post()
    @Roles('Admin')
    @ApiOperation({ summary: 'Crear mesa (Admin)' })
    crear(@Body() crearMesaDto: CrearMesaDto) {
        return this.mesasServicio.crear(crearMesaDto);
    }

    @Put(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Actualizar mesa (Admin)' })
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarMesaDto: ActualizarMesaDto,
    ) {
        return this.mesasServicio.actualizar(id, actualizarMesaDto);
    }

    @Put(':id/estado')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Actualizar estado de mesa' })
    actualizarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: EstadoMesa,
    ) {
        return this.mesasServicio.actualizarEstado(id, estado);
    }

    @Delete(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Eliminar mesa (Admin)' })
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.mesasServicio.eliminar(id);
    }
}
