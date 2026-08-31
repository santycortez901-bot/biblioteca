export type EstadoPrestamo = 'activo' | 'devuelto' | 'atrasado';
export interface Prestamo {id: string;
  socio: string; // Nombre o ID del socio
  libro: string; // Título o ID del libro
  estado: EstadoPrestamo;}
