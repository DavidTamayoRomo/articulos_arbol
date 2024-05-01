
package com.mdmq.codigomunicipal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class TokenDto {

    private String access_token;
    private String refresh_token;
    private String scope;
    private String token_type;
    private Integer expires_in;

    public TokenDto() {
    };

    public TokenDto(String access_token, String refresh_token, String scope, String token_type, Integer expires_in) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.scope = scope;
        this.token_type = token_type;
        this.expires_in = expires_in;
    }

}
