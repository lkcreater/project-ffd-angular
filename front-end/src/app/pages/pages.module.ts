import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule],
  providers: [provideClientHydration(), provideHttpClient(withFetch())],
})
export class PagesModule {}
