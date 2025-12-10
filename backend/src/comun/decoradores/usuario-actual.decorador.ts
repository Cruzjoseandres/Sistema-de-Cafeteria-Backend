import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface DatosUsuarioActual {
    usuario_id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
    rol_id: number;
}

export const UsuarioActual = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): DatosUsuarioActual => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
