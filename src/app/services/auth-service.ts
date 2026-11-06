import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface UsuarioAutenticado {
  id: number | string;
  nombre: string;
  rol: string;
}

interface RespuestaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}

export interface DatosRegistro {
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

  registro(datos: DatosRegistro): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/registro`,
      datos
    );
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
        typeof usuario.rol === 'string'
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
}