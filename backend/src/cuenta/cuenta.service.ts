import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { Cuenta } from './entities/cuenta.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const QR_FOLDER = 'cafeteria_qr';
// En producción esta variable se podría persistir en BD o en Redis.
// Para este proyecto, una variable en memoria es suficiente.
let currentQrUrl: string | null = null;
let currentQrPublicId: string | null = null;

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(createCuentaDto: CreateCuentaDto) {
    const cuenta = {
      nombre_cliente: createCuentaDto.nombre_cliente,
      total: 0,
      pedido: { id: Number(createCuentaDto.id_pedido) } as any,
      estado: { id: 1 } as any,
    };

    const cuentaCreada = await this.cuentaRepository.save(cuenta);
    return this.findOne(cuentaCreada.id);
  }

  async findAll() {
    return this.cuentaRepository.find({
      where: { D_E_L_E_T_E_D: false },
      relations: ['pedido', 'estado'],
      order: { id: 'DESC' },
    });
  }

  async findByPedido(idPedido: number) {
    return this.cuentaRepository.find({
      where: { pedido: { id: idPedido }, D_E_L_E_T_E_D: false },
      relations: ['pedido', 'estado'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, D_E_L_E_T_E_D: false },
      relations: ['pedido', 'estado'],
    });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta #${id} no encontrada`);
    }
    return cuenta;
  }

  async update(id: number, updateCuentaDto: UpdateCuentaDto) {
    const cuenta = await this.findOne(id);
    if (updateCuentaDto.nombre_cliente) cuenta.nombre_cliente = updateCuentaDto.nombre_cliente;
    if (updateCuentaDto.id_estado) {
      cuenta.estado = { id: Number(updateCuentaDto.id_estado) } as any;
    }
    if (updateCuentaDto.tipo_pago !== undefined) {
      cuenta.tipo_pago = updateCuentaDto.tipo_pago;
    }
    if (updateCuentaDto.monto_pagado !== undefined) {
      cuenta.monto_pagado = Number(updateCuentaDto.monto_pagado);
    }
    if (updateCuentaDto.monto_cambio !== undefined) {
      cuenta.monto_cambio = Number(updateCuentaDto.monto_cambio);
    }
    if (updateCuentaDto.comprobantes !== undefined) {
      cuenta.comprobantes = updateCuentaDto.comprobantes;
    }
    await this.cuentaRepository.save(cuenta);
    return this.findOne(id);
  }

  async updateTotal(id: number, total: number) {
    const cuenta = await this.findOne(id);
    cuenta.total = total;
    await this.cuentaRepository.save(cuenta);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cuenta = await this.findOne(id);
    cuenta.D_E_L_E_T_E_D = true;
    await this.cuentaRepository.save(cuenta);
    return { message: `Cuenta #${id} eliminada` };
  }

  // ---- Lógica para Gestión del QR Oficial de Pagos (Cloudinary) ----

  async uploadQRToCloudinary(file: Express.Multer.File): Promise<{ message: string; url: string }> {
    if (!file) {
      throw new HttpException('No se subió ningún archivo', HttpStatus.BAD_REQUEST);
    }

    // Eliminar el QR anterior de Cloudinary
    if (currentQrPublicId) {
      await this.cloudinaryService.deleteImage(currentQrPublicId).catch(() => { });
    }

    // Subir el nuevo QR a Cloudinary (sin recorte, solo optimización)
    const url = await this.cloudinaryService.uploadImage(file.buffer, QR_FOLDER);
    const publicId = this.cloudinaryService.extractPublicId(url);

    currentQrUrl = url;
    currentQrPublicId = publicId;

    return { message: 'QR actualizado con éxito', url };
  }

  sendQRResponse(res: Response): void {
    if (currentQrUrl) {
      // Redirigir al cliente a la URL de Cloudinary
      res.redirect(currentQrUrl);
    } else {
      res.status(HttpStatus.NOT_FOUND).send('QR no configurado');
    }
  }

  // Métodos de compatibilidad (ya no necesarios con Cloudinary, pero los mantenemos por si el controlador los llama)
  clearAnteriorQR(): void { /* No-op: manejado en uploadQRToCloudinary */ }
  saveQRFile(file: Express.Multer.File): Express.Multer.File { return file; }
  processUploadedQR(_file: Express.Multer.File): { message: string; filename: string } {
    return { message: 'QR procesado', filename: currentQrUrl || '' };
  }
}
