export type EstadoPrestamo = 'activo' | 'devuelto' | 'atrasado';
export interface Prestamo {id: string;
  socio: string;
  libro: string;
  inventario: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPrestamo;
  renovaciones: number;
}
