export type EstadoPrestamo =
  'activo' |
  'atrasado' |
  'devuelto' |
  'suspendido';

export interface Prestamo {
  actualizarNombreSocio(nombreAnterior: any, nombre: any): unknown;
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