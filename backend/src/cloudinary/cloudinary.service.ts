import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Sube una imagen desde un Buffer a Cloudinary.
   * Aplica recorte inteligente 800x800 y transformaciones f_auto/q_auto.
   * @param buffer Buffer de la imagen
   * @param folder Carpeta dentro de Cloudinary (ej. "cafeteria_menu")
   * @returns URL pública optimizada (secure_url con f_auto,q_auto)
   */
  async uploadImage(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          // Recorte inteligente centrado en el sujeto, 800x800
          transformation: [
            { width: 800, height: 800, crop: 'fill', gravity: 'auto' },
          ],
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          // Construir URL con f_auto y q_auto para entrega optimizada
          const optimizedUrl = cloudinary.url(result.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
          });
          resolve(optimizedUrl);
        },
      ).end(buffer);
    });
  }

  /**
   * Elimina una imagen de Cloudinary usando su public_id.
   * @param publicId El public_id extraído de la URL de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      // No lanzar excepción si la imagen ya no existe
      console.warn(`No se pudo eliminar la imagen de Cloudinary: ${publicId}`, error);
    }
  }

  /**
   * Sube un PDF (Buffer) a Cloudinary como recurso raw.
   * No consume créditos de transformación — solo almacenamiento.
   * @param buffer Buffer del PDF generado
   * @param publicId Nombre público opcional (sin extensión)
   * @returns URL permanente segura del PDF
   */
  async uploadPdf(buffer: Buffer, publicId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'cafeteria_pedidos',
          public_id: publicId,
          resource_type: 'image', // Cambiado de 'raw' a 'image' para mayor compatibilidad y evitar errores 401
          format: 'pdf',
          overwrite: true,
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      ).end(buffer);
    });
  }

  /**
   * Obtiene la última imagen subida a una carpeta específica.
   */
  async getLatestQRUrl(): Promise<string | null> {
    try {
      const result = await cloudinary.search
        .expression(`folder:cafeteria_qr`)
        .sort_by('created_at', 'desc')
        .max_results(1)
        .execute();

      if (result && result.resources && result.resources.length > 0) {
        // Devolver la URL segura optimizada igual que al subir
        return cloudinary.url(result.resources[0].public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
        });
      }
      return null;
    } catch (error) {
      console.error('Error fetching latest QR from Cloudinary:', error);
      return null;
    }
  }

  /**
   * Extrae el public_id de una URL de Cloudinary.
   * Ejemplo: https://res.cloudinary.com/demo/image/upload/v123/cafeteria_menu/abc123.jpg
   * Retorna: cafeteria_menu/abc123
   */
  extractPublicId(cloudinaryUrl: string): string | null {
    try {
      // Busca el patrón /upload/v{version}/{public_id}.{ext} o /upload/{public_id}.{ext}
      const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]{2,5})?(?:\?.*)?$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}
