import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nprestamo } from '../nprestamo/nprestamo';
import Swal from 'sweetalert2';
import { Prestamo, PrestamoService } from '../services/prestamo';
import { Socio } from '../models/models/socio';
import { SocioServicio } from '../services/socio';

@Component({
  selector: 'app-prestamos',
  imports: [FormsModule, Nprestamo],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos {

  prestamos: Prestamo[] = [];
  busqueda: string = '';

  filtro: 'todos' | 'activo' | 'vencido' | 'vencido' = 'todos';

  mostrarNuevoPrestamo = false;

  constructor(
    private prestamoService: PrestamoService,
    private socioService: SocioServicio
  ) {
    this.actualizarPrestamos();
  }

  actualizarPrestamos(): void {
    this.prestamos = this.prestamoService
      .obtenerPrestamos()
      .filter(p => p.estado !== 'devuelto');
  }

  obtenerSocio(idSocio: number): Socio | undefined {
    return this.socioService.tenerSocios().find(socio => socio.id === idSocio);
  }

  get prestamosFiltrados(): Prestamo[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.prestamos.filter(prestamo => {
      // Exclusión estricta de devueltos
      if (prestamo.estado === 'devuelto') {
        return false;
      }
      const socio = this.obtenerSocio(Number(prestamo.idSocio));
      const nombreSocio = socio?.nombre.toLowerCase() ?? '';

      const coincideBusqueda =
        prestamo.id.toLowerCase().includes(texto) ||
        nombreSocio.includes(texto) ||
        prestamo.libro.toLowerCase().includes(texto) ||
        prestamo.inventario.toLowerCase().includes(texto);

      const coincideFiltro =
        this.filtro === 'todos' ||
        prestamo.estado === this.filtro;

      return coincideBusqueda && coincideFiltro;
    });
  }

  cambiarFiltro(filtro: 'todos' | 'activo' | 'vencido' | 'vencido'): void {
    this.filtro = filtro;
  }

  // MODIFICADO: Abre WhatsApp con el mensaje precargado
  renovarPrestamo(prestamo: Prestamo): void {
    const socio = this.obtenerSocio(Number(prestamo.idSocio));

    if (!socio || !socio.telefono) {
      alert('No se encontró el teléfono del socio.');
      return;
    }

    // Incrementar renovaciones en el servicio
    this.prestamoService.renovarPrestamo(prestamo.id);
    this.actualizarPrestamos();

    // Construir la URL de WhatsApp Web / App
    const mensaje = encodeURIComponent(
      `Hola ${socio.nombre}, se ha renovado con éxito tu préstamo del libro "${prestamo.libro}". Tu nueva fecha de vencimiento es ${prestamo.fechaVencimiento}.`
    );

    // 1. Limpiamos cualquier +, espacio o guion que pueda haber quedado
      let tel = socio.telefono.replace(/[^0-9]/g, '');

    // 2. Si el número empieza con "54" pero no tiene el "9" (ej: 54299...), se lo insertamos
    if (tel.startsWith('54') && !tel.startsWith('549')) {
      tel = '549' + tel.slice(2);
    } 
    // 3. Si por algún motivo se guardó solo como "299...", le agregamos "549" adelante
    else if (!tel.startsWith('54')) {
      tel = '549' + tel;
    }

    // 4. Codificamos el mensaje y abrimos la ventana
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${tel}?text=${mensajeCodificado}`;

    window.open(url, '_blank');
}

  devolverPrestamo(prestamo: Prestamo): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar como devuelto el préstamo de "${prestamo.libro}"? Esta acción actualizará el registro.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Marcar estado del préstamo como devuelto en el servicio
        this.prestamoService.devolverPrestamo(prestamo.id);

        // 2. Liberar al socio para que su estado pase a 'Libre'
        this.socioService.actualizarEstadoPrestamo(prestamo.idSocio, 'Libre');

        // 3. Eliminar el préstamo de la lista local para que desaparezca la fila
        this.prestamos = this.prestamos.filter(p => p.id !== prestamo.id);

        // 4. Cartel de éxito con SweetAlert2
        Swal.fire({
          title: '¡Devuelto!',
          text: 'El préstamo ha sido marcado como devuelto correctamente.',
          icon: 'success',
          confirmButtonColor: '#0d9488',
          timer: 2000,
          showConfirmButton: false
        });
      }})}

  abrirNuevoPrestamo(): void {
    this.mostrarNuevoPrestamo = true;
  }

  cerrarNuevoPrestamo(): void {
    this.mostrarNuevoPrestamo = false;
    this.actualizarPrestamos();
  }
}