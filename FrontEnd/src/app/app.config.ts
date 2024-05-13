import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './auth/keycloak.init';
import { KeycloakAuthService } from './auth/services/keycloak-auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        BrowserAnimationsModule,
        BrowserModule,
        KeycloakService,

        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        KeycloakAuthService,
        provideAnimations(),
        provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
        provideHttpClient(withInterceptorsFromDi()),
        
    ]
};