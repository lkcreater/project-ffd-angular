import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import { firstValueFrom } from 'rxjs';

export const authenticateGuard: CanActivateFn = async (route, state) => {
  const userInfo = inject(UserInfoService);
  const router = inject(Router);

  if (state.url === '/') {
    return true;
  }

  const account = await firstValueFrom(userInfo.fetchUserInfo());
  if (!account) {
    userInfo.logoutUserInfo();
  }
  if (!userInfo.getToken()) {
    return router.createUrlTree(['/auth']);
  }

  return true;
};
