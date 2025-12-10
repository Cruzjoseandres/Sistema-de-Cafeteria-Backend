import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosControlador } from './usuarios.controlador';
import { UsuariosServicio } from './usuarios.servicio';
import { Usuario } from './entidades/usuario.entidad';
import { Persona } from '../autenticacion/entidades/persona.entidad';
import { Rol } from '../roles/entidades/rol.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario, Persona, Rol])],
    controllers: [UsuariosControlador],
    providers: [UsuariosServicio],
    exports: [UsuariosServicio],
})
export class UsuariosModulo { }
