export type EstadoSocio = 'activo' | 'inactivo' | 'suspendido';
export interface Socio {id: string;
  nombre: string;
  dni: number;
  numCarnet: string;
  edad: number;
  email: string;
  Telefono: string;
  estado: EstadoSocio;}
