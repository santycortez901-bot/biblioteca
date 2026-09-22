import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-sesion',
  imports: [FormsModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {
email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  iniciarSesion(): void {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

    if (!this.email || !regexEmail.test(this.email.trim())) {
      Swal.fire({
        title: 'Correo Inválido',
        text: 'Por favor ingresá un correo válido (@gmail.com o @hotmail.com).',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!this.password || this.password.length < 4) {
      Swal.fire({
        title: 'Contraseña Corta',
        text: 'La contraseña debe tener al menos 4 caracteres.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    // Alerta de éxito y redirección a inicio
    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Inicio de sesión exitoso.',
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/inicio']);
    });
  }

}
