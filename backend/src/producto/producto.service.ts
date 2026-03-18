import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const CLOUDINARY_FOLDER = 'cafeteria_menu';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(createProductoDto: CreateProductoDto, imagenes?: Express.Multer.File[]) {
    if (!imagenes || imagenes.length === 0) {
      throw new NotFoundException('Se requiere al menos una imagen válida (jpg, jpeg, png, gif, webp, bmp, svg)');
    }

    // Subir todas las imágenes a Cloudinary en paralelo
    const imagePaths = await Promise.all(
      imagenes.map(img => this.cloudinaryService.uploadImage(img.buffer, CLOUDINARY_FOLDER))
    );

    const producto = {
      nombre: createProductoDto.nombre,
      precio: Number(createProductoDto.precio),
      descripcion: createProductoDto.descripcion,
      disponible: createProductoDto.disponible === true || createProductoDto.disponible as any === 'true',
      imagePaths,
      categoria: { id: Number(createProductoDto.id_categoria) } as any,
    };

    const productoCreado = await this.productoRepository.save(producto);
    return this.findOne(productoCreado.id);
  }

  async findAll() {
    const productos = await this.productoRepository.find({
      where: { D_E_L_E_T_E_D: false },
      relations: ['categoria'],
      order: { id: 'ASC' },
    });

    return productos.map(producto => ({
      ...producto,
      categoria: producto.categoria ? {
        id: producto.categoria.id,
        nombre: producto.categoria.nombre
      } : null,
    }));
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id, D_E_L_E_T_E_D: false },
      relations: ['categoria'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto, imagenes?: Express.Multer.File[]) {
    const producto = await this.findOne(id);

    if (updateProductoDto.nombre) producto.nombre = updateProductoDto.nombre;
    if (updateProductoDto.precio !== undefined) producto.precio = Number(updateProductoDto.precio);
    if (updateProductoDto.descripcion !== undefined) producto.descripcion = updateProductoDto.descripcion;
    if (updateProductoDto.disponible !== undefined) {
      producto.disponible = updateProductoDto.disponible === true || updateProductoDto.disponible as any === 'true';
    }
    if (updateProductoDto.id_categoria) {
      producto.categoria = { id: Number(updateProductoDto.id_categoria) } as any;
    }

    // Determinar las URLs existentes que se conservan
    let keptPaths: string[] = producto.imagePaths || [];
    if (updateProductoDto.imagePaths !== undefined) {
      let urlsToKeep: string[];
      try {
        urlsToKeep = JSON.parse(updateProductoDto.imagePaths);
      } catch {
        urlsToKeep = [];
      }

      // Eliminar de Cloudinary las imágenes que ya no se conservan
      const removedUrls = keptPaths.filter(url => !urlsToKeep.includes(url));
      await Promise.allSettled(
        removedUrls.map(url => {
          const publicId = this.cloudinaryService.extractPublicId(url);
          return publicId ? this.cloudinaryService.deleteImage(publicId) : Promise.resolve();
        })
      );
      keptPaths = urlsToKeep;
    }

    // Subir las nuevas imágenes a Cloudinary en paralelo
    const newPaths = imagenes && imagenes.length > 0
      ? await Promise.all(imagenes.map(img => this.cloudinaryService.uploadImage(img.buffer, CLOUDINARY_FOLDER)))
      : [];

    producto.imagePaths = [...keptPaths, ...newPaths];

    await this.productoRepository.save(producto);
    return this.findOne(id);
  }

  async removeImage(id: number, imageUrl: string) {
    const producto = await this.findOne(id);

    if (!producto.imagePaths || !producto.imagePaths.includes(imageUrl)) {
      throw new BadRequestException('La imagen no pertenece a este producto');
    }

    // Eliminar de Cloudinary
    const publicId = this.cloudinaryService.extractPublicId(imageUrl);
    if (publicId) {
      await this.cloudinaryService.deleteImage(publicId);
    }

    producto.imagePaths = producto.imagePaths.filter(url => url !== imageUrl);
    await this.productoRepository.save(producto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    producto.D_E_L_E_T_E_D = true;
    await this.productoRepository.save(producto);
    return { message: `Producto #${id} eliminado` };
  }
}
