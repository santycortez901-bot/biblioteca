export type EstadoSocio =
  | 'activo'
  | 'suspendido'
  | 'bloqueado'
  | 'inactivo';

export type EstadoCuota =
  | 'pendiente'
  | 'pagada'
  | 'vencida';

export type PrestamoActual =
  | 'Libre'
  | 'Encurso';

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