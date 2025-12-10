import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosServicio } from './usuarios.servicio';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './dto';
import { Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsuariosControlador {
    constructor(private readonly usuariosServicio: UsuariosServicio) { }

    @Get()
    @Roles('Admin')
    @ApiOperation({ summary: 'Obtener todos los usuarios (Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    obtenerTodos() {
        return this.usuariosServicio.obtenerTodos();
    }

    @Get('empleados')
    @Roles('Admin')
    @ApiOperation({ summary: 'Obtener todos los empleados (Admin)' })
    obtenerEmpleados() {
        return this.usuariosServicio.obtenerPorRol('Empleado');
    }

    @Get('clientes')
    @Roles('Admin', 'Empleado')
    @ApiOperation({ summary: 'Obtener todos los clientes' })
    obtenerClientes() {
        return this.usuariosServicio.obtenerPorRol('Cliente');
    }

    @Get(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosServicio.obtenerPorId(id);
    }

    @Post('empleado')
    @Roles('Admin')
    @ApiOperation({ summary: 'Crear nuevo empleado (Admin)' })
    crearEmpleado(@Body() crearUsuarioDto: CrearUsuarioDto) {
        return this.usuariosServicio.crearEmpleado(crearUsuarioDto);
    }

    @Put(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Actualizar usuario' })
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    ) {
        return this.usuariosServicio.actualizar(id, actualizarUsuarioDto);
    }

    @Delete(':id')
    @Roles('Admin')
    @ApiOperation({ summary: 'Desactivar usuario' })
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosServicio.eliminar(id);
    }
}
