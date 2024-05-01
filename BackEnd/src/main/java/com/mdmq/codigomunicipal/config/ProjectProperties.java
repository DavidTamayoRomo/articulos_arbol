package com.mdmq.codigomunicipal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@lombok.Setter
@lombok.Getter
@Component
public class ProjectProperties {

    @Value("${WSO2.usuario.token}")
    private String wso2UsuarioToken;

    @Value("${WSO2.password.token}")
    private String wso2PasswordToken;

    @Value("${WSO2.usuario.consumidor}")
    private String wso2UsuarioConsumidor;

    @Value("${WSO2.secreto.consumidor}")
    private String wso2SecretoConsumidor;

    @Value("${WSO2.TokenUrl}")
    private String wso2TokenURL;

    @Value("${WSO2.ApiMunicipales.url}")
    private String wso2ApiMunicipalesURL;
    
    @Value("${keycloak.url}")
    private String keycloakUrl;

    @Value("${auth.client_id}")
    private String clientId;

    @Value("${auth.client_secret}")
    private String clientSecret;

    @Value("${auth.username}")
    private String username;

    @Value("${auth.password}")
    private String password;


    


}
