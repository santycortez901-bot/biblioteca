import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Panel de Administración - Biblioteca</h1>
      <p class="mb-4">Bienvenido, administrador. Aquí puedes gestionar el sistema.</p>
      
      <div class="grid gap-4">
        <button (click)="irA('libros')" class="bg-blue-500 text-white p-2 rounded">Gestionar Libros</button>
        <button (click)="irA('socios')" class="bg-green-500 text-white p-2 rounded">Gestionar Socios</button>
        <button (click)="irA('prestamos')" class="bg-purple-500 text-white p-2 rounded">Gestionar Préstamos</button>
        <button (click)="cerrarSesion()" class="bg-red-500 text-white p-2 rounded">Cerrar Sesión</button>
      </div>
    </div>
  `
})
export class AdminComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  irA(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/inicioSeson']);
  }
}