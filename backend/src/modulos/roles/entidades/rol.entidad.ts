import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entidades/usuario.entidad';

@Entity('roles')
export class Rol {
    @PrimaryGeneratedColumn()
    rol_id: number;

    @Column({ length: 50, unique: true })
    nombre: string;

    @Column({ length: 255, nullable: true })
    descripcion: string;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];
}
