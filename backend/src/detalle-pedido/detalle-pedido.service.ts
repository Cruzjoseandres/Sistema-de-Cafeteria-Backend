import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { CuentaService } from '../cuenta/cuenta.service';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private detalleRepository: Repository<DetallePedido>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private cuentaService: CuentaService,
  ) { }

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    // Obtener el producto para calcular el subtotal
    const producto = await this.productoRepository.findOne({
      where: { id: Number(createDetallePedidoDto.id_producto) },
    });
    if (!producto) {
      throw new NotFoundException(`Producto #${createDetallePedidoDto.id_producto} no encontrado`);
    }

    const cantidad = Number(createDetallePedidoDto.cantidad);
    const subtotal = Number(producto.precio) * cantidad;

    const detalle = {
      cantidad,
      subtotal,
      comentario: createDetallePedidoDto.comentario || '',
      cuenta: { id: Number(createDetallePedidoDto.id_cuenta) } as any,
      producto: { id: producto.id } as any,
      estado: { id: 1 } as any, // ACTIVO
    };

    const detalleCreado = await this.detalleRepository.save(detalle);

    // Recalcular total de la cuenta
    await this.recalcularTotalCuenta(Number(createDetallePedidoDto.id_cuenta));

    return this.findOne(detalleCreado.id);
  }

  async createBulk(createDetallePedidoDtoArray: CreateDetallePedidoDto[]) {
    if (!createDetallePedidoDtoArray || createDetallePedidoDtoArray.length === 0) return [];
    
    // Obtener ids de productos
    const productIds = Array.from(new Set(createDetallePedidoDtoArray.map(d => Number(d.id_producto))));
    // Cargar productos en memoria para obviar múltiples queries
    const productos = await this.productoRepository.findByIds(productIds);
    const productosMap = new Map(productos.map(p => [p.id, p]));

    const detallesToInsert = createDetallePedidoDtoArray.map(dto => {
      const producto = productosMap.get(Number(dto.id_producto));
      if (!producto) {
        throw new NotFoundException(`Producto #${dto.id_producto} no encontrado`);
      }
      return {
        cantidad: Number(dto.cantidad),
        subtotal: Number(producto.precio) * Number(dto.cantidad),
        comentario: dto.comentario || '',
        cuenta: { id: Number(dto.id_cuenta) } as any,
        producto: { id: producto.id } as any,
        estado: { id: 1 } as any, // ACTIVO
      };
    });

    const detallesCreados = await this.detalleRepository.save(detallesToInsert);

    // Recalcular total de las cuentas involucradas solo una vez
    const cuentasIds = Array.from(new Set(createDetallePedidoDtoArray.map(d => Number(d.id_cuenta))));
    for (const cuentaId of cuentasIds) {
      await this.recalcularTotalCuenta(cuentaId);
    }

    return detallesCreados;
  }


  async findByCuenta(idCuenta: number) {
    return this.detalleRepository.find({
      where: { cuenta: { id: idCuenta }, D_E_L_E_T_E_D: false },
      relations: ['producto', 'cuenta', 'estado'],
      order: { id: 'ASC' },
    });
  }

  async findAll() {
    return this.detalleRepository.find({
      where: { D_E_L_E_T_E_D: false },
      relations: ['producto', 'cuenta', 'estado'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const detalle = await this.detalleRepository.findOne({
      where: { id, D_E_L_E_T_E_D: false },
      relations: ['producto', 'cuenta', 'estado'],
    });
    if (!detalle) {
      throw new NotFoundException(`Detalle #${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: number, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    const detalle = await this.findOne(id);

    if (updateDetallePedidoDto.cantidad !== undefined) {
      detalle.cantidad = Number(updateDetallePedidoDto.cantidad);
      // Recalcular subtotal
      const producto = await this.productoRepository.findOne({ where: { id: detalle.producto.id } });
      if (producto) {
        detalle.subtotal = Number(producto.precio) * detalle.cantidad;
      }
    }
    if (updateDetallePedidoDto.comentario !== undefined) {
      detalle.comentario = updateDetallePedidoDto.comentario;
    }
    if (updateDetallePedidoDto.cantidad_entregada !== undefined) {
      detalle.cantidad_entregada = Number(updateDetallePedidoDto.cantidad_entregada);
    }

    await this.detalleRepository.save(detalle);

    // Recalcular total de la cuenta
    await this.recalcularTotalCuenta(detalle.cuenta.id);

    return this.findOne(id);
  }

  async bulkUpdateEntrega(items: { id: number; cantidad_entregada: number }[]) {
    if (!items || items.length === 0) return { updated: 0 };

    // Actualizar todos en paralelo con Promise.all — eficiente y seguro
    await Promise.all(
      items.map(({ id, cantidad_entregada }) =>
        this.detalleRepository.update(id, { cantidad_entregada: Number(cantidad_entregada) })
      )
    );

    return { updated: items.length };
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    const cuentaId = detalle.cuenta.id;
    detalle.D_E_L_E_T_E_D = true;
    await this.detalleRepository.save(detalle);

    // Recalcular total de la cuenta
    await this.recalcularTotalCuenta(cuentaId);

    return { message: `Detalle #${id} eliminado` };
  }

  private async recalcularTotalCuenta(idCuenta: number) {
    const detalles = await this.detalleRepository.find({
      where: { cuenta: { id: idCuenta }, D_E_L_E_T_E_D: false },
    });
    const total = detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);
    await this.cuentaService.updateTotal(idCuenta, total);
  }
}
