
package com.mdmq.codigomunicipal.service;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mdmq.codigomunicipal.config.ProjectProperties;
import com.mdmq.codigomunicipal.dto.RolDto;
import com.mdmq.codigomunicipal.dto.TokenDto;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class ServicioWSO2 {

  @Autowired
  ProjectProperties propiedades;

  public TokenDto getToken() {

    // parámetros para solicitar el token
    MultiValueMap<String, String> paramsMap1 = new LinkedMultiValueMap<String, String>();
    paramsMap1.add("grant_type", "password");
    paramsMap1.add("username", propiedades.getWso2UsuarioToken());
    paramsMap1.add("password", propiedades.getWso2PasswordToken());

    RestTemplate restTemplate = new RestTemplate();

    String urlStringToken = propiedades.getWso2TokenURL();

    // Auth Basic
    restTemplate.getInterceptors().add(
        new BasicAuthenticationInterceptor(propiedades.getWso2UsuarioConsumidor(),
            propiedades.getWso2SecretoConsumidor()));

    TokenDto response = restTemplate.postForObject(
        urlStringToken, paramsMap1,
        TokenDto.class);

    return response;
  }

  public RolDto[] getRoles(String clientId) {

    RestTemplate restTemplate = new RestTemplate();

    String urlStringRoles = propiedades.getWso2ApiMunicipalesURL() +
        "/list-roles?client_id=" + clientId;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    ResponseEntity<RolDto[]> response = restTemplate.exchange(
        urlStringRoles, HttpMethod.GET, requestEntity, RolDto[].class);

    return response.getBody();
  }

  public Object[] getUsers() {

    RestTemplate restTemplate = new RestTemplate();

    String urlStringListUsers = propiedades.getWso2ApiMunicipalesURL() +
        "/list-users";

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    ResponseEntity<Object[]> response = restTemplate.exchange(
        urlStringListUsers, HttpMethod.GET, requestEntity, Object[].class);

    return response.getBody();
  }

  public Object[] getUserByFirstName(String nombre) {

    RestTemplate restTemplate = new RestTemplate();

    String urlStringListUsers = propiedades.getWso2ApiMunicipalesURL() +
        "/get-user/firstName?firstName=" + nombre;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    ResponseEntity<Object[]> response = restTemplate.exchange(
        urlStringListUsers, HttpMethod.GET, requestEntity, Object[].class);

    return response.getBody();
  }

  public Object[] getUserByLastName(String apellido) {

    RestTemplate restTemplate = new RestTemplate();

    String urlStringListUsers = propiedades.getWso2ApiMunicipalesURL() +
        "/get-user/lastName?lastName=" + apellido;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    ResponseEntity<Object[]> response = restTemplate.exchange(
        urlStringListUsers, HttpMethod.GET, requestEntity, Object[].class);

    return response.getBody();
  }

  public Object[] getUserByUserName(String username) {

    RestTemplate restTemplate = new RestTemplate();

    String urlStringListUsers = propiedades.getWso2ApiMunicipalesURL() +
        "/get-user/username?username=" + username;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    ResponseEntity<Object[]> response = restTemplate.exchange(
        urlStringListUsers, HttpMethod.GET, requestEntity, Object[].class);

    return response.getBody();
  }

  public Integer asignarRoles(String sso_id, String client_id, List<RolDto> roles) throws JsonProcessingException {

    RestTemplate restTemplate = new RestTemplate();

    String urlAddRoles = propiedades.getWso2ApiMunicipalesURL() +
        "/client/user/add-role-mapping?user_id=" + sso_id + "&client_id=" + client_id;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<List<RolDto>> requestEntity = new HttpEntity<List<RolDto>>(roles, headers);

    ResponseEntity<Object> response = restTemplate.exchange(
        urlAddRoles, HttpMethod.POST, requestEntity, Object.class);

    return response.hashCode();
  }


  public Integer quitarRoles(String sso_id, String client_id, List<RolDto> roles) throws JsonProcessingException {


    RestTemplate restTemplate = new RestTemplate();

    String urlAddRoles = propiedades.getWso2ApiMunicipalesURL() +
        "/client/user/del-role-mapping?user_id=" + sso_id + "&client_id=" + client_id;

    TokenDto token = getToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token.getAccess_token());

    HttpEntity<List<RolDto>> requestEntity = new HttpEntity<List<RolDto>>(roles, headers);

    ResponseEntity<Object> response = restTemplate.exchange(
        urlAddRoles, HttpMethod.DELETE, requestEntity, Object.class);

    return response.hashCode();
  }

 



 
}
