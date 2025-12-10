import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutenticacionServicio } from './autenticacion.servicio';
import { RegistrarDto, IniciarSesionDto } from './dto';

@ApiTags('Autenticacion')
@Controller('autenticacion')
export class AutenticacionControlador {
    constructor(private readonly autenticacionServicio: AutenticacionServicio) { }

    @Post('registrar')
    @ApiOperation({ summary: 'Registrar nuevo usuario cliente' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiResponse({ status: 409, description: 'Email o teléfono ya registrado' })
    async registrar(@Body() registrarDto: RegistrarDto) {
        return this.autenticacionServicio.registrar(registrarDto);
    }

    @Post('iniciar-sesion')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto) {
        return this.autenticacionServicio.iniciarSesion(iniciarSesionDto);
    }
}
