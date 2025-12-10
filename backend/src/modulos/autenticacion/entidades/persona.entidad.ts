import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
} from 'typeorm';
import { Usuario } from '../../usuarios/entidades/usuario.entidad';

@Entity('personas')
export class Persona {
    @PrimaryGeneratedColumn()
    persona_id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 100 })
    apellido: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 20, nullable: true, unique: true })
    telefono: string;

    @Column({ length: 255 })
    password_hash: string;

    @CreateDateColumn()
    fecha_creacion: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToOne(() => Usuario, (usuario) => usuario.persona)
    usuario: Usuario;
}
