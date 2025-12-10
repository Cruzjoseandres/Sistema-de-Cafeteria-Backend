import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesControlador } from './roles.controlador';
import { RolesServicio } from './roles.servicio';
import { Rol } from './entidades/rol.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Rol])],
    controllers: [RolesControlador],
    providers: [RolesServicio],
    exports: [RolesServicio],
})
export class RolesModulo { }
