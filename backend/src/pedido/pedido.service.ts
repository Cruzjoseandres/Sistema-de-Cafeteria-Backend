import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Cuenta } from '../cuenta/entities/cuenta.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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
    private readonly cloudinaryService: CloudinaryService,
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
      relations: ['mesa', 'estado', 'cuentas'],
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
    const itemsTableBody: any[] = [
      [{ text: 'Cant.', style: 'tableHeader' }, { text: 'Producto', style: 'tableHeader' }, { text: 'Subtotal', style: 'tableHeader' }]
    ];

    for (const cuenta of cuentas) {
      const detalles = await this.detallePedidoRepository.find({
        where: { cuenta: { id: cuenta.id }, D_E_L_E_T_E_D: false },
        relations: ['producto']
      });
      
      if (detalles.length > 0) {
        itemsTableBody.push([
          { text: `Cuenta: ${cuenta.nombre_cliente}`, colSpan: 3, style: 'cuentaHeader' }, 
          {}, 
          {}
        ]);
      }

      let subtotalCuenta = 0;
      for (const det of detalles) {
        itemsTableBody.push([
          { text: det.cantidad.toString(), style: 'tableCell' },
          { text: det.producto?.nombre || 'Producto', style: 'tableCell' },
          { text: `Bs. ${Number(det.subtotal).toFixed(2)}`, style: 'tableCell' }
        ]);
        subtotalCuenta += Number(det.subtotal);
        totalPedido += Number(det.subtotal);
      }
      
      if (detalles.length > 0) {
        itemsTableBody.push([
          { text: `Subtotal ${cuenta.nombre_cliente}`, colSpan: 2, style: 'cuentaSubtotal' },
          {},
          { text: `Bs. ${subtotalCuenta.toFixed(2)}`, style: 'cuentaSubtotalValue' }
        ]);
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
        cuentaHeader: { bold: true, fontSize: 12, margin: [0, 8, 0, 4], color: '#333333', fillColor: '#f2f2f2' },
        cuentaSubtotal: { bold: true, fontSize: 11, alignment: 'right', margin: [0, 5, 5, 5], color: '#555555' },
        cuentaSubtotalValue: { bold: true, fontSize: 11, margin: [0, 5, 0, 5], color: '#555555' },
        totalInfo: { fontSize: 16, bold: true, alignment: 'right', margin: [0, 15, 0, 0] }
      }
    };

    const pdfDoc = await printer.createPdfKitDocument(docDefinition as any);

    // Collect PDF into a buffer
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve());
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
    const pdfBuffer = Buffer.concat(chunks);

    // Forzar descarga directa con fl_attachment para evitar problemas de CORS/iframe
    const publicId = `pedido_${pedido.id}_${Date.now()}`;
    const rawPdfUrl = await this.cloudinaryService.uploadPdf(pdfBuffer, publicId);

    // Insertar fl_attachment en la URL para que el navegador lo descargue directamente
    // antes: .../raw/upload/v123/...
    // después: .../raw/upload/fl_attachment/v123/...
    const pdfUrl = rawPdfUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');

    return pdfUrl;
  }
}