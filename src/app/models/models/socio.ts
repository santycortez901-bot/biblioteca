export type EstadoSocio = 'activo' | 'inactivo' | 'suspendido';
export type PrestamoActual = 'Encurso' | 'Libre' ;
export type EstadoCuota = 'pagada' | 'pendiente' | 'vencida';
export interface Socio {
  id: number;
  nombre: string;
  dni: string;
  numCarnet: string;
  edad: number;
  email: string;
  telefono: string;
  estado: EstadoSocio;
  prestamos: PrestamoActual;
  cuota: EstadoCuota
  ;}
