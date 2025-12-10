import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearProductoDto {
    @ApiProperty({ example: 1, description: 'ID de la categoría' })
    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    @IsNumber()
    categoria_id: number;

    @ApiProperty({ example: 'Café Americano' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    nombre: string;

    @ApiPropertyOptional({ example: 'Café negro tradicional' })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ example: 2.50 })
    @IsNotEmpty({ message: 'El precio es obligatorio' })
    @IsNumber()
    @IsPositive({ message: 'El precio debe ser positivo' })
    precio: number;

    @ApiPropertyOptional({ example: 'https://example.com/cafe.jpg' })
    @IsOptional()
    @IsString()
    imagen_url?: string;
}

export class ActualizarProductoDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    categoria_id?: number;

    @ApiPropertyOptional({ example: 'Café Americano' })
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ example: 'Café negro tradicional' })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiPropertyOptional({ example: 2.50 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    precio?: number;

    @ApiPropertyOptional({ example: 'https://example.com/cafe.jpg' })
    @IsOptional()
    @IsString()
    imagen_url?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    disponible?: boolean;
}
