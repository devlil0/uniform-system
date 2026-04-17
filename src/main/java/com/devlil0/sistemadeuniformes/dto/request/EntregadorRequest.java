package com.devlil0.sistemadeuniformes.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EntregadorRequest {


    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String telefone;
}
