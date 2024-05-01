import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment.development';


export function initializeKeycloak(keycloak: KeycloakService): () => Promise<any> {
    return (): Promise<any> => {
        return new Promise(async (res, rej) => {
            try {
                if (environment.offline) {
                    res('')
                }
                environment.keycloakConfig.realm = 'Municipales';
                if (environment.multiTenant) {
                    await keycloak.init({
                        config: environment.keycloakConfig,
                        initOptions: {
                            onLoad: 'check-sso',
                        },
                        bearerExcludedUrls: ['https://api.ipify.org/', '/assets'],
                    }).catch(err => {
                        console.log(err);
                        console.log('Error keycloak init');
                        res(new Error('Error keycloak init'))
                    });
                    res('')
                } else {
                    console.log('Realm not found');
                    res(new Error('Realm not found'))
                }
            } catch (error) {
                res(error)
            }
        });
    };
}
