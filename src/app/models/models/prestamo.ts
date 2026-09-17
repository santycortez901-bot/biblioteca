export type EstadoPrestamo =
  'activo' |
  'atrasado' |
  'devuelto' |
  'suspendido';

export interface Prestamo {
  id: string;
  socio: string;
  libro: string;
  inventario: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPrestamo;
  renovaciones: number;
  motivoSuspension?: string;
}