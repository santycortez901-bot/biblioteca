import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface UsuarioAutenticado {
  id: number | string;
  nombre: string;
  rol: 'admin' | 'super_admin';
}

export interface Administrador {
  id: number | string;
  nombre: string;
  email: string;
  rol: 'admin';
  creado: string;
}

interface RespuestaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}

export interface DatosNuevoAdministrador {
  nombre: string;
  email: string;
  contrasenia: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${API_BASE_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerAdministradores(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${this.apiUrl}/admins`);
  }

  crearAdministrador(
    datos: DatosNuevoAdministrador
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/admins`, datos);
  }

  eliminarAdministrador(id: number | string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/admins/${id}`);
  }

  login(email: string, contraseña: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${this.apiUrl}/login`, {
      email,
      contrasenia: contraseña
    }).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      })
    );
  }

  // Cierra la sesión eliminando los datos del almacenamiento local
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Obtiene el token guardado actualmente
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): UsuarioAutenticado | null {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      return null;
    }

    try {
      const usuario: unknown = JSON.parse(usuarioGuardado);
      if (
        typeof usuario === 'object' &&
        usuario !== null &&
        'id' in usuario &&
        'nombre' in usuario &&
        'rol' in usuario &&
        (typeof usuario.id === 'number' || typeof usuario.id === 'string') &&
        typeof usuario.nombre === 'string' &&
        (usuario.rol === 'admin' || usuario.rol === 'super_admin')
      ) {
        return {
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol
        };
      }
    } catch {
      return null;
    }

    return null;
  }

  estaLogueado(): boolean {
    return Boolean(this.getToken());
  }

  esAdmin(): boolean {
    return this.getUsuario()?.rol === 'admin';
  }

  esSuperAdmin(): boolean {
    return this.getUsuario()?.rol === 'super_admin';
  }

  puedeAdministrar(): boolean {
    return this.esAdmin() || this.esSuperAdmin();
  }
}