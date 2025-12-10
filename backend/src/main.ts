import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Prefijo global para API
  app.setGlobalPrefix('api');

  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Cafetería API')
    .setDescription('API para gestión de cafetería con cuentas separadas')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación y registro')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Roles', 'Gestión de roles')
    .addTag('Products', 'Gestión de productos')
    .addTag('Categories', 'Categorías de productos')
    .addTag('Tables', 'Gestión de mesas')
    .addTag('Orders', 'Gestión de pedidos')
    .addTag('Accounts', 'Cuentas separadas por cliente')
    .addTag('Reports', 'Reportes y analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger en http://localhost:${port}/api/docs`);
}

bootstrap();
