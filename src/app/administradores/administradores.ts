import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Administrador, AuthService } from '../services/auth-service';

@Component({
  selector: 'app-gestion-administradores',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './administradores.html',
  styleUrl: './administradores.css'
})
export class GestionAdministradores implements OnInit {
  administradores: Administrador[] = [];
  nombre = '';
  email = '';
  contrasenia = '';
  cargando = false;
  guardando = false;
  error = '';

  constructor(
    private auth: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.cargando = true;
    this.auth.obtenerAdministradores().subscribe({
      next: administradores => {
        this.administradores = administradores;
        this.cargando = false;
        this.changeDetector.markForCheck();
      },
      error: error => {
        this.cargando = false;
        this.error = this.mensajeError(error);
        this.changeDetector.markForCheck();
      }
    });
  }

  crearAdministrador(): void {
    const nombre = this.nombre.trim();
    const email = this.email.trim();

    if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error = 'Ingresá un nombre y un correo electrónico válido.';
      return;
    }

    if (this.contrasenia.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.guardando) {
      return;
    }

    this.error = '';
    this.guardando = true;
    this.auth.crearAdministrador({
      nombre,
      email,
      contrasenia: this.contrasenia
    }).subscribe({
      next: () => {
        this.nombre = '';
        this.email = '';
        this.contrasenia = '';
        this.guardando = false;
        this.cargarAdministradores();
      },
      error: error => {
        this.guardando = false;
        this.error = this.mensajeError(error);
        this.changeDetector.markForCheck();
      }
    });
  }

  confirmarEliminacion(administrador: Administrador): void {
    void Swal.fire({
      title: '¿Eliminar administrador?',
      text: `Se eliminará la cuenta de ${administrador.nombre} (${administrador.email}).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    }).then(resultado => {
      if (!resultado.isConfirmed) {
        return;
      }

      this.auth.eliminarAdministrador(administrador.id).subscribe({
        next: () => this.cargarAdministradores(),
        error: error => {
          this.error = this.mensajeError(error);
          this.changeDetector.markForCheck();
        }
      });
    });
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.error ??
        (error.status === 0
          ? 'No se pudo conectar con el servidor.'
          : 'No se pudo completar la operación.');
    }

    return 'No se pudo completar la operación.';
  }
}
