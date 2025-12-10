import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entidades/producto.entidad';
import { CategoriaProducto } from '../categorias/entidades/categoria-producto.entidad';
import { CrearProductoDto, ActualizarProductoDto } from './dto';

@Injectable()
export class ProductosServicio {
    constructor(
        @InjectRepository(Producto)
        private productoRepositorio: Repository<Producto>,
        @InjectRepository(CategoriaProducto)
        private categoriaRepositorio: Repository<CategoriaProducto>,
    ) { }

    async obtenerTodos(categoriaId?: number) {
        const consulta: any = { activo: true };
        if (categoriaId) {
            consulta.categoria_id = categoriaId;
        }
        return this.productoRepositorio.find({
            where: consulta,
            relations: ['categoria'],
        });
    }

    async obtenerPorId(id: number) {
        const producto = await this.productoRepositorio.findOne({
            where: { producto_id: id },
            relations: ['categoria'],
        });
        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }
        return producto;
    }

    async crear(crearProductoDto: CrearProductoDto) {
        const categoria = await this.categoriaRepositorio.findOne({
            where: { categoria_id: crearProductoDto.categoria_id },
        });
        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }
        return this.productoRepositorio.save(crearProductoDto);
    }

    async actualizar(id: number, actualizarProductoDto: ActualizarProductoDto) {
        const producto = await this.obtenerPorId(id);
        if (actualizarProductoDto.categoria_id) {
            const categoria = await this.categoriaRepositorio.findOne({
                where: { categoria_id: actualizarProductoDto.categoria_id },
            });
            if (!categoria) {
                throw new NotFoundException('Categoría no encontrada');
            }
        }
        Object.assign(producto, actualizarProductoDto);
        return this.productoRepositorio.save(producto);
    }

    async eliminar(id: number) {
        const producto = await this.obtenerPorId(id);
        producto.activo = false;
        return this.productoRepositorio.save(producto);
    }
}
