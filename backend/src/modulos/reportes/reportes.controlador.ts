import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportesServicio } from './reportes.servicio';
import { UsuarioActual, Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';
import type { DatosUsuarioActual } from '../../comun/decoradores';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reportes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportesControlador {
    constructor(private readonly reportesServicio: ReportesServicio) { }

    @Get('mis-ventas')
    @Roles('Empleado')
    @ApiOperation({ summary: 'Obtener mis ventas (empleado)' })
    @ApiQuery({ name: 'periodo', required: false, enum: ['dia', 'semana', 'mes', 'anio'] })
    obtenerMisVentas(
        @UsuarioActual() usuario: DatosUsuarioActual,
        @Query('periodo') periodo: 'dia' | 'semana' | 'mes' | 'anio' = 'dia',
    ) {
        return this.reportesServicio.obtenerVentasEmpleado(usuario.usuario_id, periodo);
    }

    @Get('ventas')
    @Roles('Admin')
    @ApiOperation({ summary: 'Obtener todas las ventas (Admin)' })
    @ApiQuery({ name: 'periodo', required: false, enum: ['dia', 'semana', 'mes', 'anio'] })
    obtenerTodasLasVentas(
        @Query('periodo') periodo: 'dia' | 'semana' | 'mes' | 'anio' = 'dia',
    ) {
        return this.reportesServicio.obtenerTodasLasVentas(periodo);
    }

    @Get('productos-top')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener productos más vendidos' })
    @ApiQuery({ name: 'periodo', required: false, enum: ['dia', 'semana', 'mes', 'anio'] })
    @ApiQuery({ name: 'limite', required: false, type: Number })
    obtenerProductosTop(
        @Query('periodo') periodo: 'dia' | 'semana' | 'mes' | 'anio' = 'mes',
        @Query('limite') limite: number = 10,
    ) {
        return this.reportesServicio.obtenerProductosTop(periodo, limite);
    }
}
