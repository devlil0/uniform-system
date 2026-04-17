package com.devlil0.sistemadeuniformes.dto.request;

import com.devlil0.sistemadeuniformes.enums.Cor;
import com.devlil0.sistemadeuniformes.enums.Malha;
import com.devlil0.sistemadeuniformes.enums.NomeUniforme;
import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UniformeRequest {

    private Long id;

    @NotNull(message = "O nome é obrigatório")
    private NomeUniforme nome;

    @NotNull(message = "A malha é obrigatória")
    private Malha malha;

    @NotNull(message = "O tamanho é obrigatório")
    private Tamanho tamanho;

    @NotNull(message = "O refletivo é obrigatório")
    private Refletivo refletivo;

    @NotNull(message = "A cor é obrigatória")
    private Cor cor;
}
