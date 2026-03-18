import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from './entities/mesa.entity';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
  ) { }

  async create(createMesaDto: CreateMesaDto) {
    const mesa = this.mesaRepository.create({
      numero: createMesaDto.numero,
      capacidad: createMesaDto.capacidad,
      descripcion: createMesaDto.descripcion,
      es_juntada: createMesaDto.es_juntada || false,
      estado: createMesaDto.id_estado ? { id: createMesaDto.id_estado } as any : undefined,
    });
    const saved = await this.mesaRepository.save(mesa);
    return this.findOne(saved.id);
  }

  async findAll() {
    return this.mesaRepository.find({
      where: { D_E_L_E_T_E_D: false },
      relations: ['estado'],
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number) {
    const mesa = await this.mesaRepository.findOne({
      where: { id, D_E_L_E_T_E_D: false },
      relations: ['estado'],
    });
    if (!mesa) {
      throw new NotFoundException(`Mesa #${id} no encontrada`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.findOne(id);
    if (updateMesaDto.numero !== undefined) mesa.numero = updateMesaDto.numero;
    if (updateMesaDto.capacidad !== undefined) mesa.capacidad = updateMesaDto.capacidad;
    if (updateMesaDto.descripcion !== undefined) mesa.descripcion = updateMesaDto.descripcion;
    if (updateMesaDto.es_juntada !== undefined) mesa.es_juntada = updateMesaDto.es_juntada;
    if (updateMesaDto.id_estado) {
      mesa.estado = { id: updateMesaDto.id_estado } as any;
    }
    await this.mesaRepository.save(mesa);
    return this.findOne(id);
  }

  async remove(id: number) {
    const mesa = await this.findOne(id);
    mesa.D_E_L_E_T_E_D = true;
    await this.mesaRepository.save(mesa);
    return { message: `Mesa #${id} eliminada` };
  }
}
