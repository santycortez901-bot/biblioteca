export type EstadoPrestamo =
  'activo' |
  'atrasado' |
  'devuelto' |
  'suspendido';


export interface Prestamo {

  id: string;

  // ID del socio al que pertenece el préstamo
  socioId: number;

  // Nombre del socio
  socio: string;

  libro: string;

  inventario: string;

  fechaInicio: string;

  fechaVencimiento: string;

  estado: EstadoPrestamo;

  renovaciones: number;

  motivoSuspension?: string;

}