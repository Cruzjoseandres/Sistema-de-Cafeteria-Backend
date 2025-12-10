import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entidades/producto.entidad';

@Entity('categorias_producto')
export class CategoriaProducto {
    @PrimaryGeneratedColumn()
    categoria_id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 255, nullable: true })
    descripcion: string;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];
}
