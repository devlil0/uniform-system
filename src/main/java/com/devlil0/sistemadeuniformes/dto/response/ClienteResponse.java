package com.devlil0.sistemadeuniformes.dto.response;


import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class ClienteResponse {

    private Long id;
    private String nome;
    private String contato;

}
