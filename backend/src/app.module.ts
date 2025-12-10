import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacionModulo } from './modulos/autenticacion/autenticacion.modulo';
import { UsuariosModulo } from './modulos/usuarios/usuarios.modulo';
import { RolesModulo } from './modulos/roles/roles.modulo';
import { ProductosModulo } from './modulos/productos/productos.modulo';
import { CategoriasModulo } from './modulos/categorias/categorias.modulo';
import { MesasModulo } from './modulos/mesas/mesas.modulo';
import { PedidosModulo } from './modulos/pedidos/pedidos.modulo';
import { CuentasModulo } from './modulos/cuentas/cuentas.modulo';
import { ReportesModulo } from './modulos/reportes/reportes.modulo';

// Entidades
import { Persona } from './modulos/autenticacion/entidades/persona.entidad';
import { Usuario } from './modulos/usuarios/entidades/usuario.entidad';
import { Rol } from './modulos/roles/entidades/rol.entidad';
import { CategoriaProducto } from './modulos/categorias/entidades/categoria-producto.entidad';
import { Producto } from './modulos/productos/entidades/producto.entidad';
import { Mesa } from './modulos/mesas/entidades/mesa.entidad';
import { Pedido } from './modulos/pedidos/entidades/pedido.entidad';
import { Cuenta, DetalleCuenta } from './modulos/cuentas/entidades';
import { Transaccion } from './modulos/reportes/entidades/transaccion.entidad';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [
          Persona,
          Rol,
          Usuario,
          CategoriaProducto,
          Producto,
          Mesa,
          Pedido,
          Cuenta,
          DetalleCuenta,
          Transaccion,
        ],
        synchronize: true, // Solo en desarrollo
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AutenticacionModulo,
    UsuariosModulo,
    RolesModulo,
    ProductosModulo,
    CategoriasModulo,
    MesasModulo,
    PedidosModulo,
    CuentasModulo,
    ReportesModulo,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
