import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AutenticacionServicio } from '../autenticacion.servicio';

@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private autenticacionServicio: AutenticacionServicio,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        });
    }

    async validate(payload: { sub: number; email: string; rol: string }) {
        const usuario = await this.autenticacionServicio.validarUsuario(payload);
        if (!usuario) {
            throw new UnauthorizedException('Usuario no autorizado');
        }
        return usuario;
    }
}
