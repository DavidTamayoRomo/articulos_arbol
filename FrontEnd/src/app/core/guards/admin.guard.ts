import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { KeycloakService } from "keycloak-angular";
import { environment } from "../../../environments/environment.development";
import { KeycloakAuthService } from "../../auth/services/keycloak-auth.service";


export const adminGuard = async () => {
    const keycloakAuthService = inject(KeycloakAuthService);
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    if (!keycloakAuthService.IsAuthenticated()) {
        localStorage.setItem('realm', 'Municipales');
        environment.keycloakConfig.realm = localStorage.getItem('realm')!;
        const config = environment.keycloakConfig;
        keycloakService.init({
            config,
            initOptions: {
                onLoad: 'check-sso',
                checkLoginIframe: true,
                checkLoginIframeInterval: 5,
            },
            loadUserProfileAtStartUp: true,
            enableBearerInterceptor: true,
        }).then();
        await keycloakService.login({
            redirectUri: environment.home_page
        });
    } else {
        if (environment.keycloakConfig.realm === 'Ciudadanos') {
            router.navigate(['']);
            return false;
        }
    }

    return true;
}
