import { Routes } from '@angular/router';
import { PageErrorComponent } from './components/page-error/page-error.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./authenticate/authenticate.module').then((m) => m.AuthenticateModule),
  },
  {
    path: '**',
    component: PageErrorComponent
  }
];
