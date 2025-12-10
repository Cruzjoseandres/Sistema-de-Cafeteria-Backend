import { IsNotEmpty, IsOptional, IsNumber, IsPositive, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearCuentaDto {
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente para esta cuenta' })
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
    @IsString()
    nombre_cliente: string;

    @ApiPropertyOptional({ example: '+58412123456', description: 'Teléfono del cliente' })
    @IsOptional()
    @IsString()
    telefono_cliente?: string;
}

export class AgregarItemDto {
    @ApiProperty({ example: 1, description: 'ID del producto' })
    @IsNotEmpty({ message: 'El producto es obligatorio' })
    @IsNumber()
    producto_id: number;

    @ApiProperty({ example: 2, description: 'Cantidad del producto' })
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    @IsNumber()
    @IsPositive({ message: 'La cantidad debe ser positiva' })
    cantidad: number;

    @ApiPropertyOptional({ example: 'Sin azúcar', description: 'Notas especiales' })
    @IsOptional()
    @IsString()
    notas?: string;
}

export enum MetodoPago {
    EFECTIVO = 'efectivo',
    TARJETA = 'tarjeta',
    TRANSFERENCIA = 'transferencia',
}

export class PagarCuentaDto {
    @ApiPropertyOptional({ enum: MetodoPago, default: MetodoPago.EFECTIVO })
    @IsOptional()
    @IsEnum(MetodoPago)
    metodo_pago?: MetodoPago;

    @ApiPropertyOptional({ example: 2.50, description: 'Propina' })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    propina?: number;

    @ApiPropertyOptional({ example: 'REF-12345', description: 'Referencia del pago' })
    @IsOptional()
    @IsString()
    referencia?: string;
}
