import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesServicio } from './roles.servicio';
import { Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';

@ApiTags('Roles')
@Controller('roles')
export class RolesControlador {
    constructor(private readonly rolesServicio: RolesServicio) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los roles' })
    obtenerTodos() {
        return this.rolesServicio.obtenerTodos();
    }

    @Post('sembrar')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sembrar roles por defecto (Admin)' })
    sembrar() {
        return this.rolesServicio.sembrarRolesPorDefecto();
    }
}
