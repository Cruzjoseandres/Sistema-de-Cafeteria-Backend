
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocurrió un error inesperado en el servidor al procesar la solicitud.';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      errorName = exception.name;

      if (typeof res === 'object' && res !== null) {
        if (Array.isArray(res.message)) {
          message = res.message.join('. ');
        } else if (typeof res.message === 'string') {
          message = res.message;
        } else if (typeof res.error === 'string') {
          message = res.error;
        } else {
          message = exception.message;
        }
      } else if (typeof res === 'string') {
        message = res;
      } else {
        message = exception.message;
      }
    } else if (exception && typeof exception === 'object') {
      // Manejo de errores de base de datos de Postgres (TypeORM QueryFailedError) y otros errores
      errorName = exception.name || 'DatabaseError';
      const pgCode = exception.code;
      const exceptionMsg = exception.message || '';

      if (pgCode === '23503' || exceptionMsg.includes('foreign key constraint') || exceptionMsg.includes('violates foreign key')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'No se puede procesar la operación porque hace referencia a un registro que no existe o aún no ha sido guardado (por ejemplo, intentar cobrar o asociar un ítem a un pedido que no está guardado en el sistema).';
      } else if (pgCode === '23505' || exceptionMsg.includes('unique constraint') || exceptionMsg.includes('duplicate key')) {
        status = HttpStatus.CONFLICT;
        message = 'Ya existe un registro con este mismo nombre o identificador en el sistema. Por favor, verifica que no esté duplicado.';
      } else if (pgCode === '23502' || exceptionMsg.includes('null value in column') || exceptionMsg.includes('not-null constraint')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Falta completar un campo obligatorio o los datos enviados están incompletos.';
      } else if (pgCode === '22P02' || exceptionMsg.includes('invalid input syntax')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'El formato de uno o más datos ingresados es incorrecto (por ejemplo, texto donde se espera un número o ID inválido).';
      } else if (exceptionMsg) {
        // En desarrollo o si el mensaje es explícito, lo mostramos amigablemente
        message = process.env.NODE_ENV !== 'production' ? exceptionMsg : message;
      }
    } else if (typeof exception === 'string') {
      message = exception;
    }

    this.logger.error(
      `[${request.method}] ${request.url} -> Status: ${status} | Message: ${message}`,
      exception?.stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: errorName,
    });
  }
}
