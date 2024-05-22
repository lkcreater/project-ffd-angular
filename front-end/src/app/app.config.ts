import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideNzIcons } from './icons-provider';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userInfoReducer } from './stores/user-info/user-info.reducer';
import { ApiInterceptor } from './core/interceptor/api.interceptor';
import { lineChanelReducer } from './stores/line-chanel/line-chanel.reducer';
import { termConditionReducer } from './stores/term-condition/term-condition.reducer';
import { configReducer } from './stores/config/config.reducer';
import { questionnaireReducer } from './stores/questionnaire/questionnaire.reducer';
import { gameReducer } from './stores/game/game.reducer';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzIcons(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideStore({
      userInfo: userInfoReducer,
      lineChanel: lineChanelReducer,
      termCondition: termConditionReducer,
      config: configReducer,
      questionnaire: questionnaireReducer,
      game: gameReducer,
    }),
    provideEffects(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
};
