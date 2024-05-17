import { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
    url: 'https://sso-poc.quito.gob.ec:8443/auth/',
    realm: 'Municipales',
    clientId: 'app-codigo-municipal',
};

export const environment = {
    production: false,
    offline: false,
    multiTenant: true,
    home_page: 'http://172.16.20.36:4200/admin/lista-articulos',
    home: 'http://172.16.20.36:4200/articulos',
    keycloakConfig,

    url_api: 'http://172.16.20.36:8080/api',

};
