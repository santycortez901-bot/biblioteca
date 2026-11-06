import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { EstadoPrestamo, Prestamo } from '../models/models/prestamo';

interface PrestamoApi {
  id: string;
  socio_id: number;
  libro_id: string;
  inventario: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: EstadoPrestamo;
  renovaciones: number;
  motivo_suspension: string | null;
  socio_nombre: string;
  libro_titulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/prestamos`;
  private readonly prestamosSubject = new BehaviorSubject<Prestamo[]>([]);
  readonly prestamos$: Observable<Prestamo[]> = this.prestamosSubject.asObservable();

  obtenerPrestamos(): Prestamo[] {
    return [...this.prestamosSubject.getValue()];
  }

  cargarPrestamos(): Observable<Prestamo[]> {
    return this.http.get<PrestamoApi[]>(this.apiUrl).pipe(
      map(prestamos => prestamos.map(prestamo => ({
        id: String(prestamo.id),
        socioId: Number(prestamo.socio_id),
        socio: prestamo.socio_nombre,
        libro: prestamo.libro_titulo ?? '',
        libroId: String(prestamo.libro_id ?? ''),
        inventario: prestamo.inventario,
        fechaInicio: prestamo.fecha_inicio.slice(0, 10),
        fechaVencimiento: prestamo.fecha_vencimiento.slice(0, 10),
        estado: prestamo.estado,
        renovaciones: Number(prestamo.renovaciones ?? 0),
        motivoSuspension: prestamo.motivo_suspension ?? undefined
      }))),
      tap(prestamos => this.prestamosSubject.next(prestamos))
    );
  }

  agregarPrestamo(nuevo: Prestamo & { libroId?: string }): Observable<void> {
    return this.http.post(this.apiUrl, {
      id: nuevo.id,
      socio_id: nuevo.socioId,
      libro_id: nuevo.libroId,
      inventario: nuevo.inventario,
      fecha_inicio: nuevo.fechaInicio,
      fecha_vencimiento: nuevo.fechaVencimiento
    }).pipe(
      switchMap(() => this.cargarPrestamos()),
      map(() => undefined)
    );
  }

  eliminarPrestamo(id: string): Observable<Prestamo> {
    const prestamo = this.obtenerPrestamos().find(item => item.id === id);
    if (!prestamo) {
      return throwError(() => new Error('No se encontró el préstamo para eliminar.'));
    }

    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(
      switchMap(() => this.cargarPrestamos()),
      map(() => prestamo)
    );
  }

  devolverPrestamo(id: string): Observable<void> {
    return this.actualizar(id, { accion: 'devolver' });
  }

  renovarPrestamo(id: string): Observable<void> {
    const prestamo = this.obtenerPrestamos().find(item => item.id === id);
    if (!prestamo) {
      return throwError(() => new Error('No se encontró el préstamo para renovar.'));
    }

    const fecha = new Date(`${prestamo.fechaVencimiento}T00:00:00`);
    fecha.setMonth(fecha.getMonth() + 1);
    return this.actualizar(id, {
      estado: prestamo.estado,
      fecha_vencimiento: fecha.toISOString().slice(0, 10),
      renovaciones: prestamo.renovaciones + 1,
      motivo_suspension: prestamo.motivoSuspension ?? null
    });
  }

  suspenderPrestamo(id: string): Observable<void> {
    const prestamo = this.obtenerPrestamos().find(item => item.id === id);
    if (!prestamo) {
      return throwError(() => new Error('No se encontró el préstamo para suspender.'));
    }
    return this.actualizar(id, {
      estado: 'suspendido',
      fecha_vencimiento: prestamo.fechaVencimiento,
      renovaciones: prestamo.renovaciones,
      motivo_suspension: prestamo.motivoSuspension ?? null
    });
  }

  quitarSuspension(id: string): Observable<void> {
    const prestamo = this.obtenerPrestamos().find(item => item.id === id);
    if (!prestamo) {
      return throwError(() => new Error('No se encontró el préstamo.'));
    }
    const hoy = new Date().toISOString().slice(0, 10);
    return this.actualizar(id, {
      estado: prestamo.fechaVencimiento < hoy ? 'atrasado' : 'activo',
      fecha_vencimiento: prestamo.fechaVencimiento,
      renovaciones: prestamo.renovaciones,
      motivo_suspension: null
    });
  }

  private actualizar(id: string, datos: Record<string, string | number | null>): Observable<void> {
    return this.http.put(`${this.apiUrl}/${encodeURIComponent(id)}`, datos).pipe(
      switchMap(() => this.cargarPrestamos()),
      map(() => undefined)
    );
  }
}
