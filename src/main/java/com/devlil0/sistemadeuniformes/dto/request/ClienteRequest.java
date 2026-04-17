package com.devlil0.sistemadeuniformes.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ClienteRequest {


    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String contato;
}
