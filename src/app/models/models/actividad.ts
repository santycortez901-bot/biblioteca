export type TipoActividad = 'login' | 'prestamo' | 'cuota' | 'socio' | 'libro' | 'eliminacion' | 'edicion';
export interface Actividad {
    tipo: TipoActividad;
  descripcion: string;
  fecha: string;
  user: string;
  idrelacionado?: string;
}
