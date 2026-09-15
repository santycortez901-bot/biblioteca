import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {

  // Variable para almacenar la fecha actual
   fechaActual: string = '';

  private intervalo: any;

  ngOnInit(): void {
    this.actualizarFecha();

    // Actualiza la fecha automáticamente
    this.intervalo = setInterval(() => {
      this.actualizarFecha();
    }, 60000); // cada 1 minuto
  }

  actualizarFecha(): void {
    const ahora = new Date();

    this.fechaActual = ahora.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  // cambiar de componente y activar los botones de nuevo prestamo y cargar socio
  constructor(private router: Router) {}

  abrirNuevoPrestamo(): void {
    this.router.navigate(['/prestamos'], {
      queryParams: {
        mostrarNuevoPrestamo: 'true'
      }
    });
  }

  cargarSocio(): void {
    this.router.navigate(['/socios'], {
      queryParams: {
        openModal: 'true'
      }
    });
  }
}
