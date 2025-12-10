import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacionControlador } from './autenticacion.controlador';
import { AutenticacionServicio } from './autenticacion.servicio';
import { JwtEstrategia } from './estrategias/jwt.estrategia';
import { Persona } from './entidades/persona.entidad';
import { Usuario } from '../usuarios/entidades/usuario.entidad';
import { Rol } from '../roles/entidades/rol.entidad';

@Module({
    imports: [
        TypeOrmModule.forFeature([Persona, Usuario, Rol]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN') ?? '1h';
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn: expiresIn as '1h' | '24h' | '7d' | '30d',
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AutenticacionControlador],
    providers: [AutenticacionServicio, JwtEstrategia],
    exports: [AutenticacionServicio, JwtEstrategia, PassportModule],
})
export class AutenticacionModulo { }
