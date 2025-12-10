import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Pedido } from '../../pedidos/entidades/pedido.entidad';
import { DetalleCuenta } from './detalle-cuenta.entidad';
import { Transaccion } from '../../reportes/entidades/transaccion.entidad';

export enum EstadoCuenta {
    PENDIENTE = 'pendiente',
    PAGADA = 'pagada',
    CANCELADA = 'cancelada',
}

@Entity('cuentas')
export class Cuenta {
    @PrimaryGeneratedColumn()
    cuenta_id: number;

    @Column()
    pedido_id: number;

    @Column({ length: 100 })
    nombre_cliente: string;

    @Column({ length: 20, nullable: true })
    telefono_cliente: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    propina: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total: number;

    @Column({
        type: 'enum',
        enum: EstadoCuenta,
        default: EstadoCuenta.PENDIENTE,
    })
    estado: EstadoCuenta;

    @Column({ nullable: true })
    fecha_pago: Date;

    @ManyToOne(() => Pedido, (pedido) => pedido.cuentas)
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @OneToMany(() => DetalleCuenta, (detalle) => detalle.cuenta)
    detalles: DetalleCuenta[];

    @OneToMany(() => Transaccion, (transaccion) => transaccion.cuenta)
    transacciones: Transaccion[];
}
