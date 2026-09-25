export type EstadoCuota = 'pagada' | 'pendiente' | 'inactivo';
export interface Cuota {
  id: string;
  nombreSocio: string;
  numSocio: number;
  dni: string;
  estado: EstadoCuota;
};
