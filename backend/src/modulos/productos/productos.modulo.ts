import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosControlador } from './productos.controlador';
import { ProductosServicio } from './productos.servicio';
import { Producto } from './entidades/producto.entidad';
import { CategoriaProducto } from '../categorias/entidades/categoria-producto.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Producto, CategoriaProducto])],
    controllers: [ProductosControlador],
    providers: [ProductosServicio],
    exports: [ProductosServicio],
})
export class ProductosModulo { }
