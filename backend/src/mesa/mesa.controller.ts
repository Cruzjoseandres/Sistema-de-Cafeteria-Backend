import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mesa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) { }

  @Post()
  @Roles('ADMINISTRADOR')
  async create(@Body() createMesaDto: CreateMesaDto) {
    return await this.mesaService.create(createMesaDto);
  }

  @Get()
  @Roles('ADMINISTRADOR', 'MESERO')
  async findAll() {
    return await this.mesaService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRADOR', 'MESERO')
  async findOne(@Param('id') id: string) {
    return await this.mesaService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMINISTRADOR')
  async update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return await this.mesaService.update(+id, updateMesaDto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  async remove(@Param('id') id: string) {
    return await this.mesaService.remove(+id);
  }
}
