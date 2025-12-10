import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from '../../pedidos/entidades/pedido.entidad';

export enum EstadoMesa {
    LIBRE = 'libre',
    OCUPADA = 'ocupada',
    RESERVADA = 'reservada',
}

@Entity('mesas')
export class Mesa {
    @PrimaryGeneratedColumn()
    mesa_id: number;

    @Column({ length: 20 })
    numero: string;

    @Column({ default: 4 })
    capacidad: number;

    @Column({
        type: 'enum',
        enum: EstadoMesa,
        default: EstadoMesa.LIBRE,
    })
    estado: EstadoMesa;

    @Column({ length: 255, nullable: true })
    descripcion: string;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Pedido, (pedido) => pedido.mesa)
    pedidos: Pedido[];
}
