import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoriaProducto } from '../../categorias/entidades/categoria-producto.entidad';
import { DetalleCuenta } from '../../cuentas/entidades/detalle-cuenta.entidad';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    producto_id: number;

    @Column()
    categoria_id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 500, nullable: true })
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: number;

    @Column({ length: 255, nullable: true })
    imagen_url: string;

    @Column({ default: true })
    disponible: boolean;

    @Column({ default: true })
    activo: boolean;

    @ManyToOne(() => CategoriaProducto, (categoria) => categoria.productos)
    @JoinColumn({ name: 'categoria_id' })
    categoria: CategoriaProducto;

    @OneToMany(() => DetalleCuenta, (detalle) => detalle.producto)
    detallesCuenta: DetalleCuenta[];
}
