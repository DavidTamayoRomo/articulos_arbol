package com.mdmq.codigomunicipal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mdmq.codigomunicipal.config.ProjectProperties;
import com.mdmq.codigomunicipal.dto.ClienteKeycloakDto;
import com.mdmq.codigomunicipal.dto.RolDto;
import com.mdmq.codigomunicipal.dto.TokenKeycloakDto;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class KeycloakService {

    @Autowired
    ProjectProperties propiedades;

    public TokenKeycloakDto getTokenAdmin() {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", propiedades.getClientId());
        body.add("client_secret", propiedades.getClientSecret());
        body.add("username", propiedades.getUsername());
        body.add("password", propiedades.getPassword());
        body.add("grant_type", "password");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        String url = propiedades.getKeycloakUrl() + "/auth/realms/master/protocol/openid-connect/token";
        ResponseEntity<TokenKeycloakDto> response = restTemplate.exchange(url, HttpMethod.POST, request,
                TokenKeycloakDto.class);

        return response.getBody();
    }

    public ClienteKeycloakDto getClientInfo(String clientId) throws JsonMappingException, JsonProcessingException {

        TokenKeycloakDto token = getTokenAdmin();

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token.getAccess_token());

        HttpEntity<Void> request = new HttpEntity<>(headers);
        String url = propiedades.getKeycloakUrl()+ "/auth/admin/realms/Municipales/clients?clientId=" + clientId;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        String responseBody = response.getBody();

        ObjectMapper objectMapper = new ObjectMapper();
        List<ClienteKeycloakDto> clientes = objectMapper.readValue(responseBody, objectMapper.getTypeFactory().constructCollectionType(List.class, ClienteKeycloakDto.class));

        return clientes.get(0);
    }


    public List<RolDto> getRolByUserCliente(String userId, String clientId) throws JsonMappingException, JsonProcessingException {

        TokenKeycloakDto token = getTokenAdmin();

        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token.getAccess_token());

        HttpEntity<Void> request = new HttpEntity<>(headers);
        String url = propiedades.getKeycloakUrl()+ "/auth/admin/realms/Municipales/users/"+userId+"/role-mappings/clients/"+clientId;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        String responseBody = response.getBody();

        ObjectMapper objectMapper = new ObjectMapper();
        List<RolDto> roles = objectMapper.readValue(responseBody, objectMapper.getTypeFactory().constructCollectionType(List.class, RolDto.class));

        return roles;
    }

}
