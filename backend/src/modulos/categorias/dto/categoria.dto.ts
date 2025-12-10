import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearCategoriaDto {
    @ApiProperty({ example: 'Bebidas' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    nombre: string;

    @ApiPropertyOptional({ example: 'Bebidas calientes y frías' })
    @IsOptional()
    @IsString()
    descripcion?: string;
}

export class ActualizarCategoriaDto {
    @ApiPropertyOptional({ example: 'Bebidas' })
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ example: 'Bebidas calientes y frías' })
    @IsOptional()
    @IsString()
    descripcion?: string;
}
