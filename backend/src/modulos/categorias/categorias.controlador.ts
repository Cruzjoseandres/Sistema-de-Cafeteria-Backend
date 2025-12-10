import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriasServicio } from './categorias.servicio';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './dto';
import { Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasControlador {
    constructor(private readonly categoriasServicio: CategoriasServicio) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    obtenerTodas() {
        return this.categoriasServicio.obtenerTodas();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener categoría por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.categoriasServicio.obtenerPorId(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear categoría (Admin)' })
    crear(@Body() crearCategoriaDto: CrearCategoriaDto) {
        return this.categoriasServicio.crear(crearCategoriaDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar categoría (Admin)' })
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarCategoriaDto: ActualizarCategoriaDto,
    ) {
        return this.categoriasServicio.actualizar(id, actualizarCategoriaDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar categoría (Admin)' })
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.categoriasServicio.eliminar(id);
    }
}
