import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Asegura que reconozca directivas básicas
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Socio } from '../models/models/socio';
import { CuotasService } from '../services/cuotas-service';

@Component({
  selector: 'app-cuotas',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Mantenemos ambos módulos para el HTML
  templateUrl: './cuotas.html', 
  styleUrl: './cuotas.css',
})
export class Cuotas implements OnInit {
  cuotas: Socio[] = []; 
  filtroActivo: string = 'todos';
  terminoBusqueda: string = ''; 

  constructor(
    private cuotaService: CuotasService,
    private cdr: ChangeDetectorRef // 👈 Inyección para forzar el renderizado del botón
  ) {}

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas(): void {
    // Rompemos la referencia del array para forzar la actualización del HTML
    this.cuotas = [...this.cuotaService.obtenerCuotas()];  
  }

  filtrarPorEstado(estado: string): void {
    this.filtroActivo = estado;
  }

  // ⬇️ REPOSTERÍA DEL GETTER QUE SE HABÍA BORRADO ⬇️
  get cuotasFiltradas(): Socio[] {
    let resultado = this.cuotas;

    // Filtro por botones de estado
    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(socio =>
        this.filtroActivo === 'inactivo'
          ? socio.estado === 'inactivo'
          : socio.cuota === this.filtroActivo
      );
    }

    // Filtro por buscador (nombre, DNI o carnet)
    if (this.terminoBusqueda.trim() !== '') {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(socio => 
        socio.nombre.toLowerCase().includes(busqueda) || 
        socio.dni.includes(busqueda) ||                       
        socio.numCarnet.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  }

  cobrar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cobrar esta cuota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, cobrar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        const socioCobrar = this.cuotas.find(socio => socio.id === id);

        // 1. Modifica el estado en el servicio central de socios
        this.cuotaService.cobrarCuota(id);

        // 2. Modificación reactiva manual local
        this.cuotas = this.cuotas.map(socio => {
          if (socio.id === id) {
            return { ...socio, cuota: 'pagada' };
          }
          return socio;
        });

        // 3. Forzamos la actualización completa
        this.cargarCuotas();
        this.cdr.detectChanges(); // 👈 Remueve el botón al milisegundo

        Swal.fire({
          title: '¡Cuota Pagada!',
          text: `La cuota del socio "${socioCobrar?.nombre}" se ha cobrado exitosamente.`,
          icon: 'success',
          confirmButtonColor: '#0d9488',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  notificarSocio(socio: Socio): void {
    this.cuotaService.enviarRecordatorioWhatsApp(socio);
  }

 darDeBaja(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se cambiará el estado del socio a "Inactivo" y se abrirá el aviso por WhatsApp.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', 
    cancelButtonColor: '#6b7280',  
    confirmButtonText: 'Sí, dar de baja',
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {
      // 1. Llama al método del servicio (el servicio se encarga de buscar y de abrir WhatsApp)
      this.cuotaService.darDeBaja(id);

      // 2. Forzamos el refresco completo de la tabla local
      this.cargarCuotas();
      this.cdr.detectChanges();
    }
  });
}
}
