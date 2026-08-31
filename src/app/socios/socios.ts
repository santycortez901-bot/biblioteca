import { Component } from '@angular/core';
import { Socio } from '../models/models/socio';
@Component({
  selector: 'app-socios',
  imports: [],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
  socios: Socio[] = [
    {
      id: "s001",
      nombre: "Julieta Chiara",
      dni: '48123169',
      numCarnet: 'c-001',
      edad: 19,
      email: "julichi2345@gmail.com",
      telefono: '2991234567',
      estado: 'activo'
    },{
      id: "s002",
      nombre: "Ignacio Maldonado",
      dni:'48123329',
      numCarnet: 'c-002',
      edad: 19,
      email: "nachota12@gmail.com",
      telefono: '2993399772',
      estado: 'bloqueado'
    }
  ];
}
