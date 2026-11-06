import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [FormsModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {
  email = '';
  password = '';
  iniciandoSesion = false;
  error = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  iniciarSesion(): void {
    if (this.iniciandoSesion) {
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !regexEmail.test(this.email.trim())) {
      Swal.fire({
        title: 'Correo Inválido',
        text: 'Ingresá un correo electrónico válido.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!this.password.trim()) {
      Swal.fire({
        title: 'Contraseña requerida',
        text: 'Ingresá tu contraseña.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    this.error = '';
    this.iniciandoSesion = true;
    this.auth.login(this.email.trim(), this.password)
      .pipe(finalize(() => {
        this.iniciandoSesion = false;
      }))
      .subscribe({
        next: () => {
          void this.router.navigate(['/inicio']);
        },
        error: (error: unknown) => {
          this.error = error instanceof HttpErrorResponse
            ? error.error?.error ??
              (error.status === 0
                ? 'No se pudo conectar con el servidor. Verificá que el backend esté iniciado.'
                : 'No se pudo iniciar sesión.')
            : 'No se pudo iniciar sesión.';
        }
      });
  }
}
