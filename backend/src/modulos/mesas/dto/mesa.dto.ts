import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoMesa } from '../entidades/mesa.entidad';

export class CrearMesaDto {
    @ApiProperty({ example: 'M01' })
    @IsNotEmpty({ message: 'El número de mesa es obligatorio' })
    @IsString()
    numero: string;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    capacidad?: number;

    @ApiPropertyOptional({ example: 'Mesa junto a la ventana' })
    @IsOptional()
    @IsString()
    descripcion?: string;
}

export class ActualizarMesaDto {
    @ApiPropertyOptional({ example: 'M01' })
    @IsOptional()
    @IsString()
    numero?: string;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    capacidad?: number;

    @ApiPropertyOptional({ enum: EstadoMesa })
    @IsOptional()
    @IsEnum(EstadoMesa)
    estado?: EstadoMesa;

    @ApiPropertyOptional({ example: 'Mesa junto a la ventana' })
    @IsOptional()
    @IsString()
    descripcion?: string;
}
