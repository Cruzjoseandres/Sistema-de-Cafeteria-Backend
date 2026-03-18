import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Cuenta } from '../cuenta/entities/cuenta.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import * as fs from 'fs';
import * as path from 'path';
const PdfPrinter = require('pdfmake/js/Printer').default;
const virtualfs = require('pdfmake/js/virtual-fs').default;
const URLResolver = require('pdfmake/js/URLResolver').default;

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto) {
    const nuevoPedido = this.pedidoRepository.create({
      mesa: { id: createPedidoDto.id_mesa },
      usuario: { id: createPedidoDto.id_usuario },
      estado: { id: 1 }, // PENDIENTE por defecto
      fecha_apertura: new Date(),
    });
    return await this.pedidoRepository.save(nuevoPedido);
  }

  async findAll() {
    return await this.pedidoRepository.find({
      relations: ['mesa', 'usuario', 'usuario.persona', 'estado'],
      where: { D_E_L_E_T_E_D: false },
      order: { created_at: 'DESC' }
    });
  }

  async findMisPedidos(userId: number) {
    return await this.pedidoRepository.find({
      relations: ['mesa', 'estado'],
      where: { D_E_L_E_T_E_D: false, usuario: { id: userId } },
      order: { created_at: 'DESC' }
    });
  }

  async findByMesa(idMesa: number) {
    return await this.pedidoRepository.find({
      relations: ['mesa', 'usuario', 'usuario.persona', 'estado'],
      where: { D_E_L_E_T_E_D: false, mesa: { id: idMesa } },
      order: { created_at: 'DESC' }
    });
  }

  async findActiveByMesa(idMesa: number) {
    return await this.pedidoRepository.find({
      relations: ['mesa', 'usuario', 'usuario.persona', 'estado'],
      where: [
        { D_E_L_E_T_E_D: false, mesa: { id: idMesa }, estado: { id: 1 } },
        { D_E_L_E_T_E_D: false, mesa: { id: idMesa }, estado: { id: 2 } }
      ],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id, D_E_L_E_T_E_D: false },
      relations: ['mesa', 'usuario', 'usuario.persona', 'estado']
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);
    if (updatePedidoDto.id_estado) {
      pedido.estado = { id: updatePedidoDto.id_estado } as any;
    }
    // Update other fields if necessary
    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: number, justificativo: string) {
    const pedido = await this.findOne(id);
    pedido.D_E_L_E_T_E_D = true;
    pedido.justificativo_eliminacion = justificativo;
    return await this.pedidoRepository.save(pedido);
  }

  async generateWhatsAppPdf(id: number, apiUrl: string) {
    const pedido = await this.findOne(id);
    const cuentas = await this.cuentaRepository.find({
      where: { pedido: { id }, D_E_L_E_T_E_D: false }
    });
    
    let totalPedido = 0;
    const itemsTableBody = [
      [{ text: 'Cant.', style: 'tableHeader' }, { text: 'Producto', style: 'tableHeader' }, { text: 'Subtotal', style: 'tableHeader' }]
    ];

    for (const cuenta of cuentas) {
      const detalles = await this.detallePedidoRepository.find({
        where: { cuenta: { id: cuenta.id }, D_E_L_E_T_E_D: false },
        relations: ['producto']
      });

      for (const det of detalles) {
        itemsTableBody.push([
          { text: det.cantidad.toString(), style: 'tableCell' },
          { text: det.producto?.nombre || 'Producto', style: 'tableCell' },
          { text: `Bs. ${Number(det.subtotal).toFixed(2)}`, style: 'tableCell' }
        ]);
        totalPedido += Number(det.subtotal);
      }
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const urlResolver = new URLResolver(virtualfs);
    const printer = new PdfPrinter(fonts, virtualfs, urlResolver);
    
    const docDefinition = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        { text: 'Cafetería - Detalle de Pedido', style: 'header' },
        { text: `Pedido #${pedido.id}`, style: 'subheader' },
        { text: `Mesa: ${pedido.mesa?.numero || 'N/A'}`, margin: [0, 5, 0, 5] },
        { text: `Fecha: ${new Date().toLocaleString()}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: itemsTableBody
          },
          layout: 'lightHorizontalLines'
        },
        { text: `Total a Pagar: Bs. ${totalPedido.toFixed(2)}`, style: 'totalInfo' }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
        tableCell: { margin: [0, 5, 0, 5] },
        totalInfo: { fontSize: 16, bold: true, alignment: 'right', margin: [0, 15, 0, 0] }
      }
    };

    const pdfDoc = await printer.createPdfKitDocument(docDefinition as any);
    
    // Ensure uploads folder exists
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const pedidosDir = path.join(uploadsDir, 'pedidos');
    if (!fs.existsSync(pedidosDir)) {
      fs.mkdirSync(pedidosDir, { recursive: true });
    }

    const fileName = `pedido_${pedido.id}_${Date.now()}.pdf`;
    const filePath = path.join(pedidosDir, fileName);
    
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(null));
      writeStream.on('error', reject);
    });

    return `${apiUrl}/uploads/pedidos/${fileName}`;
  }
}