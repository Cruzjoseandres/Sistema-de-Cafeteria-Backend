import { Mesa } from '../../mesa/entities/mesa.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_cliente: string;

    @Column()
    telefono: string;

    @Column()
    fecha_reserva: Date;

    @ManyToOne(() => Mesa)
    @JoinColumn({ name: 'id_mesa' })
    mesa: Mesa;

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
