export class UpdateCuentaDto {
    nombre_cliente?: string;
    id_estado?: number;
    tipo_pago?: string;
    monto_pagado?: number;
    monto_cambio?: number;
    monto_efectivo?: number;
    monto_qr?: number;
    comprobantes?: string[];
}
