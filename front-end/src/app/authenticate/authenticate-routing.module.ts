import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutComponent } from '../layouts/pages-layout/pages-layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CallbackComponent } from './callback/callback.component';
import { ChanelComponent } from './chanel/chanel.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LiffAuthenComponent } from './liff-authen/liff-authen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogOutComponent } from './log-out/log-out.component';

const routes: Routes = [
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'chanel',
        component: ChanelComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'callback',
        component: CallbackComponent,
      },
      {
        path: 'liff-authen',
        component: LiffAuthenComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'log-out',
        component: LogOutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticateRoutingModule {}
