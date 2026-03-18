import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CuentaService } from './cuenta.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('cuenta')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) { }

  @Post()
  @Roles('ADMINISTRADOR', 'MESERO')
  async create(@Body() createCuentaDto: CreateCuentaDto) {
    return await this.cuentaService.create(createCuentaDto);
  }

  @Get()
  @Roles('ADMINISTRADOR', 'MESERO')
  async findAll() {
    return await this.cuentaService.findAll();
  }

  // ---- Endpoints para manejo del QR Oficial ----
  
  @Post('qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new HttpException('Solo se permiten imágenes', HttpStatus.BAD_REQUEST), false);
      }
    }
  }))
  uploadQR(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No se subió ningún archivo', HttpStatus.BAD_REQUEST);
    }
    return this.cuentaService.uploadQRToCloudinary(file);
  }

  @Public()
  @Get('qr')
  getQR(@Res() res: Response) {
    this.cuentaService.sendQRResponse(res);
  }

  // ----------------------------------------------

  @Get('pedido/:idPedido')
  @Roles('ADMINISTRADOR', 'MESERO')
  async findByPedido(@Param('idPedido') idPedido: string) {
    return await this.cuentaService.findByPedido(+idPedido);
  }

  @Get(':id')
  @Roles('ADMINISTRADOR', 'MESERO')
  async findOne(@Param('id') id: string) {
    return await this.cuentaService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMINISTRADOR', 'MESERO')
  async update(@Param('id') id: string, @Body() updateCuentaDto: UpdateCuentaDto) {
    return await this.cuentaService.update(+id, updateCuentaDto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  async remove(@Param('id') id: string) {
    return await this.cuentaService.remove(+id);
  }
}
