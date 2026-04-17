package com.devlil0.sistemadeuniformes.dto.response;

import com.devlil0.sistemadeuniformes.enums.Cor;
import com.devlil0.sistemadeuniformes.enums.Malha;
import com.devlil0.sistemadeuniformes.enums.NomeUniforme;
import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import lombok.Data;

@Data
public class UniformeResponse {

    private Long id;
    private NomeUniforme nome;
    private Malha malha;
    private Tamanho tamanho;
    private Refletivo refletivo;
    private Cor cor;
}
