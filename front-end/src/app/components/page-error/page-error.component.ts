import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-error',
  standalone: true,
  imports: [NzResultModule, NzButtonModule, RouterLink],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss'
})
export class PageErrorComponent {

}
