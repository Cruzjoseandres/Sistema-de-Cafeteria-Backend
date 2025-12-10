import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Persona } from '../../autenticacion/entidades/persona.entidad';
import { Rol } from '../../roles/entidades/rol.entidad';
import { Pedido } from '../../pedidos/entidades/pedido.entidad';
import { Transaccion } from '../../reportes/entidades/transaccion.entidad';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    usuario_id: number;

    @Column()
    persona_id: number;

    @Column()
    rol_id: number;

    @CreateDateColumn()
    fecha_creacion: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToOne(() => Persona, (persona) => persona.usuario)
    @JoinColumn({ name: 'persona_id' })
    persona: Persona;

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @OneToMany(() => Pedido, (pedido) => pedido.empleado)
    pedidos: Pedido[];

    @OneToMany(() => Transaccion, (transaccion) => transaccion.empleado)
    transacciones: Transaccion[];
}
