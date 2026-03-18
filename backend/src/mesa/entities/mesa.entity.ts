import { Pedido } from "src/pedido/entities/pedido.entity";
import { Estado } from "src/estado/entities/estado.entity";
import { Column, Entity, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Mesa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numero: number;

    @Column()
    capacidad: number;

    @ManyToOne(() => Estado)
    @JoinColumn({ name: 'id_estado' })
    estado: Estado;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ default: false })
    es_juntada: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @Column({ default: false })
    D_E_L_E_T_E_D: boolean;

    @OneToMany(() => Pedido, (pedido) => pedido.mesa)
    @JoinColumn()
    pedidos: Pedido[];
}
