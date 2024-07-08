
package com.mdmq.codigomunicipal.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mdmq.codigomunicipal.dto.ClienteKeycloakDto;
import com.mdmq.codigomunicipal.dto.RolDto;
import com.mdmq.codigomunicipal.dto.TokenKeycloakDto;
import com.mdmq.codigomunicipal.service.KeycloakService;

import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class KeycloakController {

    @Autowired
    private KeycloakService keycloakService;

    @PostMapping(path = "/keycloak/get-token", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TokenKeycloakDto> getToken() throws Exception {
        try {
            TokenKeycloakDto usuario = keycloakService.getTokenAdmin();

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = "/keycloak/get-client/{clientId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClienteKeycloakDto> getUserByFirstName(@PathVariable String clientId) throws Exception {
        try {
            ClienteKeycloakDto usuario = keycloakService.getClientInfo(clientId);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping(path = "/keycloak/get-rol-user-client/{clientId}/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RolDto>> getRolByUserCliente(@PathVariable String clientId, @PathVariable String userId) throws Exception {
        try {
            List<RolDto> usuario = keycloakService.getRolByUserCliente(userId, clientId);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
