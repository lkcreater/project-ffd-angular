import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './pages-layout.component.html',
  styleUrl: './pages-layout.component.scss',
})
export class PagesLayoutComponent {}
