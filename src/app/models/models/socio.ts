export type EstadoSocio =
  | 'activo'
  | 'suspendido'
  | 'inactivo';

export type EstadoCuota =
  | 'pendiente'
  | 'pagada'
  | 'vencida';

export type PrestamoActual =
  | 'Libre'
  | 'En curso';

export interface Socio {
  id: number;
  numCarnet: string;

  nombre: string;
  edad: number;
  dni: string;
  telefono: string;
  email: string;

  estado: EstadoSocio;
  cuota: EstadoCuota;
  prestamos: PrestamoActual;
}