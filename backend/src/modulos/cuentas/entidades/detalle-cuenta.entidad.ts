import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cuenta } from './cuenta.entidad';
import { Producto } from '../../productos/entidades/producto.entidad';

@Entity('detalles_cuenta')
export class DetalleCuenta {
    @PrimaryGeneratedColumn()
    detalle_id: number;

    @Column()
    cuenta_id: number;

    @Column()
    producto_id: number;

    @Column()
    cantidad: number;

    @Column('decimal', { precision: 10, scale: 2 })
    precio_unitario: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column({ length: 500, nullable: true })
    notas: string;

    @ManyToOne(() => Cuenta, (cuenta) => cuenta.detalles)
    @JoinColumn({ name: 'cuenta_id' })
    cuenta: Cuenta;

    @ManyToOne(() => Producto, (producto) => producto.detallesCuenta)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;
}
