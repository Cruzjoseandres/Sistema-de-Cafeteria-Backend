import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearUsuarioDto {
    @ApiProperty({ example: 'Juan' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    nombre: string;

    @ApiProperty({ example: 'Pérez' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @IsString()
    apellido: string;

    @ApiProperty({ example: 'juan@email.com' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'El email debe ser válido' })
    email: string;

    @ApiPropertyOptional({ example: '+58412123456' })
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({ example: 2, description: 'ID del rol' })
    @IsNotEmpty({ message: 'El rol es obligatorio' })
    @IsNumber()
    rol_id: number;
}

export class ActualizarUsuarioDto {
    @ApiPropertyOptional({ example: 'Juan' })
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ example: 'Pérez' })
    @IsOptional()
    @IsString()
    apellido?: string;

    @ApiPropertyOptional({ example: 'juan@email.com' })
    @IsOptional()
    @IsEmail({}, { message: 'El email debe ser válido' })
    email?: string;

    @ApiPropertyOptional({ example: '+58412123456' })
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiPropertyOptional({ example: 'newpassword123' })
    @IsOptional()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password?: string;
}
