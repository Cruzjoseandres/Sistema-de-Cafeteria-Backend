import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductosServicio } from './productos.servicio';
import { CrearProductoDto, ActualizarProductoDto } from './dto';
import { Roles } from '../../comun/decoradores';
import { RolesGuard } from '../../comun/guardias';

@ApiTags('Productos')
@Controller('productos')
export class ProductosControlador {
    constructor(private readonly productosServicio: ProductosServicio) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiQuery({ name: 'categoria', required: false, type: Number })
    obtenerTodos(@Query('categoria') categoriaId?: number) {
        return this.productosServicio.obtenerTodos(categoriaId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener producto por ID' })
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.productosServicio.obtenerPorId(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear producto (Admin)' })
    crear(@Body() crearProductoDto: CrearProductoDto) {
        return this.productosServicio.crear(crearProductoDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar producto (Admin)' })
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarProductoDto: ActualizarProductoDto,
    ) {
        return this.productosServicio.actualizar(id, actualizarProductoDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar producto (Admin)' })
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.productosServicio.eliminar(id);
    }
}
