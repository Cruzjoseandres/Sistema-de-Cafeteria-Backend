import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesasControlador } from './mesas.controlador';
import { MesasServicio } from './mesas.servicio';
import { Mesa } from './entidades/mesa.entidad';

@Module({
    imports: [TypeOrmModule.forFeature([Mesa])],
    controllers: [MesasControlador],
    providers: [MesasServicio],
    exports: [MesasServicio],
})
export class MesasModulo { }
