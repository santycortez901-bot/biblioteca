import { Component } from '@angular/core';
import {RouterLink,RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav {}
