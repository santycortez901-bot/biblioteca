export type EstadoCuota = 'pagada' | 'pendiente' | 'vencida';
export interface Cuota {
  id: string;
  nombreSocio: string;
  dni: string;
  estado: EstadoCuota;
};
