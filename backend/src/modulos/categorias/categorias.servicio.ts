import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaProducto } from './entidades/categoria-producto.entidad';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './dto';

@Injectable()
export class CategoriasServicio {
    constructor(
        @InjectRepository(CategoriaProducto)
        private categoriaRepositorio: Repository<CategoriaProducto>,
    ) { }

    async obtenerTodas() {
        return this.categoriaRepositorio.find({ where: { activo: true } });
    }

    async obtenerPorId(id: number) {
        const categoria = await this.categoriaRepositorio.findOne({
            where: { categoria_id: id },
        });
        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }
        return categoria;
    }

    async crear(crearCategoriaDto: CrearCategoriaDto) {
        return this.categoriaRepositorio.save(crearCategoriaDto);
    }

    async actualizar(id: number, actualizarCategoriaDto: ActualizarCategoriaDto) {
        const categoria = await this.obtenerPorId(id);
        Object.assign(categoria, actualizarCategoriaDto);
        return this.categoriaRepositorio.save(categoria);
    }

    async eliminar(id: number) {
        const categoria = await this.obtenerPorId(id);
        categoria.activo = false;
        return this.categoriaRepositorio.save(categoria);
    }
}
