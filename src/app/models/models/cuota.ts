export type EstadoCuota = 'pagada' | 'pendiente' | 'vencida';
export interface Cuota {
  id: string;
  nombreSocio: string;
  numSocio: number;
  dni: string;
  estado: EstadoCuota;
};
