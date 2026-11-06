import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Actividad, TipoActividad } from '../models/models/actividad';
import Swal from 'sweetalert2';

interface ActividadApi extends Actividad {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadServicio {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/actividades`;
  private readonly actividadesSubject = new BehaviorSubject<Actividad[]>([]);
  private readonly erroresSubject = new Subject<unknown>();
  readonly errores$: Observable<unknown> = this.erroresSubject.asObservable();

  obtenerActividades(): Actividad[] {
    return [...this.actividadesSubject.getValue()];
  }

  cargarActividades(): Observable<Actividad[]> {
    return this.http.get<ActividadApi[]>(this.apiUrl).pipe(
      map(actividades => actividades.map(({ id, ...actividad }) => actividad)),
      tap(actividades => this.actividadesSubject.next(actividades))
    );
  }

  agregarActividad(actividad: Actividad): void {
    this.registrarActividad(
      actividad.tipo,
      actividad.descripcion,
      actividad.idrelacionado
    );
  }

  registrarActividad(
    tipo: TipoActividad,
    descripcion: string,
    idRelacionado?: string
  ): void {
    this.http.post(this.apiUrl, {
      tipo,
      descripcion,
      idrelacionado: idRelacionado ?? null
    }).pipe(
      switchMap(() => this.cargarActividades())
    ).subscribe({
      error: error => {
        console.error('No se pudo registrar la actividad en la API.', error);
        this.erroresSubject.next(error);
        const mensaje = error instanceof Error
          ? error.message
          : 'No se pudo guardar el registro de actividad.';
        void Swal.fire({
          title: 'No se pudo registrar la actividad',
          text: mensaje,
          icon: 'warning',
          confirmButtonColor: '#0d9488'
        });
      }
    });
  }
}
