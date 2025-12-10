import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Mesa } from '../../mesas/entidades/mesa.entidad';
import { Usuario } from '../../usuarios/entidades/usuario.entidad';
import { Cuenta } from '../../cuentas/entidades/cuenta.entidad';

export enum EstadoPedido {
    ABIERTO = 'abierto',
    EN_PROCESO = 'en_proceso',
    CERRADO = 'cerrado',
    CANCELADO = 'cancelado',
}

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    pedido_id: number;

    @Column()
    mesa_id: number;

    @Column()
    empleado_id: number;

    @CreateDateColumn()
    fecha_apertura: Date;

    @Column({ nullable: true })
    fecha_cierre: Date;

    @Column({
        type: 'enum',
        enum: EstadoPedido,
        default: EstadoPedido.ABIERTO,
    })
    estado: EstadoPedido;

    @Column({ length: 500, nullable: true })
    notas: string;

    @ManyToOne(() => Mesa, (mesa) => mesa.pedidos)
    @JoinColumn({ name: 'mesa_id' })
    mesa: Mesa;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    @JoinColumn({ name: 'empleado_id' })
    empleado: Usuario;

    @OneToMany(() => Cuenta, (cuenta) => cuenta.pedido)
    cuentas: Cuenta[];
}
