import { Mesa } from "src/mesa/entities/mesa.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Estado } from "src/estado/entities/estado.entity";
import { Cuenta } from "src/cuenta/entities/cuenta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha_apertura: Date;

    @Column({ nullable: true })
    fecha_cierre: Date;

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

    @Column({ nullable: true, length: 500 })
    justificativo_eliminacion: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @ManyToOne(() => Mesa, (mesa) => mesa.pedidos)
    @JoinColumn({ name: 'id_mesa' })
    mesa: Mesa;

    @OneToMany(() => Cuenta, (cuenta) => cuenta.pedido)
    cuentas: Cuenta[];
}
