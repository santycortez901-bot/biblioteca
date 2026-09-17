import { Component, OnInit } from '@angular/core';
import { Socio } from '../models/models/socio';
import { CuotasService } from '../services/cuotas-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cuotas',
  imports: [FormsModule],
  templateUrl: './cuotas.html', 
  styleUrl: './cuotas.css',
})
export class Cuotas {
  cuotas: Socio[] = []; // 👈 Cambiado a tipo Socio
  filtroActivo: string = 'todos';
  terminoBusqueda: string = ''; 

  constructor(private cuotaService: CuotasService) {}

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas(): void {
    this.cuotas = this.cuotaService.obtenerCuotas();
  }

  filtrarPorEstado(estado: string): void {
    this.filtroActivo = estado;
  }

  get cuotasFiltradas(): Socio[] {
    let resultado = this.cuotas;

    // Filtro por botones
    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(socio => socio.cuota === this.filtroActivo);
    }

    // Filtro por buscador (mapeando carnet usando 'numCarnet' de tu servicio)
    if (this.terminoBusqueda.trim() !== '') {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(socio => 
        socio.nombre.toLowerCase().includes(busqueda) || 
        socio.dni.includes(busqueda) ||                       
        socio.numCarnet.toLowerCase().includes(busqueda) // 👈 Adaptado a tu propiedad 'numCarnet'
      );
    }

    return resultado;
  }

  cobrar(id: number): void {
    const confirmarCobro = confirm('¿Estás seguro de que deseas cobrar esta cuota?');

    if (!confirmarCobro) {
      return; 
    }

    // 1. Modifica el estado en el servicio central de socios
    this.cuotaService.cobrarCuota(id); 
    
    // 2. Recarga los datos para refrescar la pantalla instantáneamente
    this.cargarCuotas();

    alert('¡Cuota cobrada con éxito!');
  }

  notificarSocio(socio: Socio): void {
    this.cuotaService.enviarRecordatorioWhatsApp(socio);
  }

  darDeBaja(id: number): void {
    this.cuotaService.darDeBaja(id);

  }
}