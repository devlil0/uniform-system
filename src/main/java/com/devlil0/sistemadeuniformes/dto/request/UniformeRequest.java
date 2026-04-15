package com.devlil0.sistemadeuniformes.dto.request;

import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UniformeRequest {

    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "A malha é obrigatória")
    private String malha;

    @NotNull(message = "O tamanho é obrigatório")
    private Tamanho tamanho;

    @NotNull(message = "O refletivo é obrigatório")
    private Refletivo refletivo;

    @NotBlank(message = "A cor é obrigatória")
    private String cor;
}
