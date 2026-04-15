package com.devlil0.sistemadeuniformes.dto.response;

import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import lombok.Data;

@Data
public class UniformeResponse {

    private Long id;
    private String nome;
    private String malha;
    private Tamanho tamanho;
    private Refletivo refletivo;
    private String cor;
}
