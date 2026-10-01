export type TipoActividad = 'login' | 'prestamo' | 'cuota' | 'socio' | 'libro';
export interface Actividad {
    tipo: TipoActividad;
  descripcion: string;
  fecha: string;
  user: string;
  idrelacionado?: string;
}
