import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Cuenta } from '../../cuentas/entidades/cuenta.entidad';
import { Usuario } from '../../usuarios/entidades/usuario.entidad';

export enum MetodoPago {
    EFECTIVO = 'efectivo',
    TARJETA = 'tarjeta',
    TRANSFERENCIA = 'transferencia',
}

@Entity('transacciones')
export class Transaccion {
    @PrimaryGeneratedColumn()
    transaccion_id: number;

    @Column()
    cuenta_id: number;

    @Column()
    empleado_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    monto: number;

    @Column({
        type: 'enum',
        enum: MetodoPago,
        default: MetodoPago.EFECTIVO,
    })
    metodo_pago: MetodoPago;

    @CreateDateColumn()
    fecha: Date;

    @Column({ length: 100, nullable: true })
    referencia: string;

    @ManyToOne(() => Cuenta, (cuenta) => cuenta.transacciones)
    @JoinColumn({ name: 'cuenta_id' })
    cuenta: Cuenta;

    @ManyToOne(() => Usuario, (usuario) => usuario.transacciones)
    @JoinColumn({ name: 'empleado_id' })
    empleado: Usuario;
}
