import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPedido } from '../entidades/pedido.entidad';

export class CrearPedidoDto {
    @ApiProperty({ example: 1, description: 'ID de la mesa' })
    @IsNotEmpty({ message: 'La mesa es obligatoria' })
    @IsNumber()
    mesa_id: number;

    @ApiPropertyOptional({ example: 'Sin hielo en las bebidas' })
    @IsOptional()
    @IsString()
    notas?: string;
}

export class ActualizarPedidoDto {
    @ApiPropertyOptional({ enum: EstadoPedido, description: 'Estado del pedido' })
    @IsOptional()
    @IsEnum(EstadoPedido)
    estado?: EstadoPedido;

    @ApiPropertyOptional({ example: 'Actualización de notas' })
    @IsOptional()
    @IsString()
    notas?: string;
}
