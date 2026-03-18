import { Pedido } from '../../pedido/entities/pedido.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Cuenta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    nombre_cliente: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number;

    @Column({ nullable: true })
    tipo_pago: string; // 'Efectivo', 'QR', etc.

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto_pagado: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto_cambio: number;

    @Column({ type: 'json', nullable: true })
    comprobantes: string[]; // Rutas a las imágenes de los pagos QR

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'id_pedido' })
    pedido: Pedido;

    @ManyToOne(() => Estado)
    @JoinColumn({ name: 'id_estado' })
    estado: Estado;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @Column({ default: false })
    D_E_L_E_T_E_D: boolean;
}
