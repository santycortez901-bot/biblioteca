import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get nombreUsuario(): string {
    return this.auth.getUsuario()?.nombre ?? 'Invitado';
  }

  get inicialUsuario(): string {
    return this.nombreUsuario.charAt(0).toUpperCase() || 'U';
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/inicioSesion']);
  }
}
