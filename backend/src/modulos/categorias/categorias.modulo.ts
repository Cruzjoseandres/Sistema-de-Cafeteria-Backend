import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasControlador } from './categorias.controlador';
import { CategoriasServicio } from './categorias.servicio';
import { CategoriaProducto } from './entidades/categoria-producto.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriaProducto])],
    controllers: [CategoriasControlador],
    providers: [CategoriasServicio],
    exports: [CategoriasServicio],
})
export class CategoriasModulo { }
