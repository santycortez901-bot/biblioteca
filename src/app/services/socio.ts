import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  EstadoCuota,
  EstadoSocio,
  PrestamoActual,
  Socio
} from '../models/models/socio';

interface SocioApi {
  id: number;
  num_carnet: string;
  nombre: string;
  edad: number;
  dni: string;
  telefono: string | null;
  email: string | null;
  estado: EstadoSocio;
  cuota: EstadoCuota;
  prestamos: PrestamoActual;
}

@Injectable({
  providedIn: 'root'
})
export class SocioServicio {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/socios`;
  private readonly sociosSubject = new BehaviorSubject<Socio[]>([]);
  readonly socios$: Observable<Socio[]> = this.sociosSubject.asObservable();

  tenerSocios(): Socio[] {
    return [...this.sociosSubject.getValue()];
  }

  cargarSocios(): Observable<Socio[]> {
    return this.http.get<SocioApi[]>(this.apiUrl).pipe(
      map(socios => socios.map(socio => this.fromApi(socio))),
      tap(socios => this.sociosSubject.next(socios))
    );
  }

  agregarSocio(socio: Omit<Socio, 'id' | 'numCarnet'>): Observable<void> {
    const carnetNumbers = this.tenerSocios()
      .map(item => Number(item.numCarnet.match(/\d+$/)?.[0] ?? 0));
    const numCarnet = `C-${String(Math.max(0, ...carnetNumbers) + 1).padStart(4, '0')}`;

    return this.http.post(this.apiUrl, this.toApi({ ...socio, id: 0, numCarnet })).pipe(
      switchMap(() => this.cargarSocios()),
      map(() => undefined)
    );
  }

  actualizarSocio(socio: Socio): Observable<void> {
    return this.http.put(`${this.apiUrl}/${socio.id}`, this.toApi(socio)).pipe(
      switchMap(() => this.cargarSocios()),
      map(() => undefined)
    );
  }

  modificarSocio(socio: Socio): Observable<void> {
    return this.actualizarSocio(socio);
  }

  actualizarEstadoPrestamo(
    idSocio: number | string,
    nuevoEstado: PrestamoActual
  ): Observable<void> {
    return this.actualizarCampo(idSocio, { prestamos: nuevoEstado });
  }

  actualizarEstadoSocio(
    idSocio: number | string,
    nuevoEstado: EstadoSocio
  ): Observable<void> {
    return this.actualizarCampo(idSocio, { estado: nuevoEstado });
  }

  actualizarEstadoCuota(
    idSocio: number | string,
    nuevoEstado: EstadoCuota
  ): Observable<void> {
    return this.actualizarCampo(idSocio, { cuota: nuevoEstado });
  }

  private actualizarCampo(
    idSocio: number | string,
    cambios: Partial<Pick<Socio, 'estado' | 'cuota' | 'prestamos'>>
  ): Observable<void> {
    const socio = this.tenerSocios().find(item => item.id === Number(idSocio));
    if (!socio) {
      return throwError(() => new Error('No se encontró el socio para actualizar.'));
    }

    return this.actualizarSocio({ ...socio, ...cambios });
  }

  private fromApi(socio: SocioApi): Socio {
    return {
      id: Number(socio.id),
      numCarnet: socio.num_carnet,
      nombre: socio.nombre,
      edad: Number(socio.edad),
      dni: socio.dni,
      telefono: socio.telefono ?? '',
      email: socio.email ?? '',
      estado: socio.estado,
      cuota: socio.cuota,
      prestamos: socio.prestamos
    };
  }

  private toApi(socio: Socio): Omit<SocioApi, 'id'> {
    return {
      num_carnet: socio.numCarnet,
      nombre: socio.nombre,
      edad: socio.edad,
      dni: socio.dni,
      telefono: socio.telefono,
      email: socio.email,
      estado: socio.estado,
      cuota: socio.cuota,
      prestamos: socio.prestamos
    };
  }
}
