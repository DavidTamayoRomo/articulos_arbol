
package com.mdmq.codigomunicipal.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mdmq.codigomunicipal.dto.RolDto;
import com.mdmq.codigomunicipal.dto.TokenDto;
import com.mdmq.codigomunicipal.service.ServicioWSO2;

import org.springframework.web.bind.annotation.RequestMapping;



@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class WSO2RestController {

    @Autowired
    private ServicioWSO2 servicioWSO2;

    

    @PostMapping(path = "/wso2/get-token", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TokenDto> getToken() throws Exception {
        try {
            TokenDto usuario = servicioWSO2.getToken();

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(path = "/wso2/agregar-roles/{clientId}/{ssoId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> registrarRoles(@PathVariable String clientId,@PathVariable String ssoId, @RequestBody List<RolDto> roles) throws Exception {
        try {
            Integer usuario = servicioWSO2.asignarRoles(ssoId,clientId,roles);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(path = "/wso2/get-users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object[]> getUsers() throws Exception {
        try {
            Object[] usuario = servicioWSO2.getUsers();

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = "/wso2/get-users-firstName/{firstName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object[]> getUserByFirstName(@PathVariable String firstName) throws Exception {
        try {
            Object[] usuario = servicioWSO2.getUserByFirstName(firstName);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = "/wso2/get-users-lastName/{lastName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object[]> getUserByLastName(@PathVariable String lastName) throws Exception {
        try {
            Object[] usuario = servicioWSO2.getUserByLastName(lastName);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    
    @GetMapping(path = "/wso2/get-roles/{clientId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RolDto[]> getRoles(@PathVariable String clientId) throws Exception {
        try {
            RolDto[] usuario = servicioWSO2.getRoles(clientId);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(path = "/wso2/quitar-roles/{clientId}/{ssoId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> quitarRoles(@PathVariable String clientId,@PathVariable String ssoId, @RequestBody List<RolDto> roles) throws Exception {
        try {
            Integer usuario = servicioWSO2.quitarRoles(ssoId,clientId,roles);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    
}
