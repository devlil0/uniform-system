package com.devlil0.sistemadeuniformes.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CostureiraResponse {

    private Long id;
    private String nome;
    private String telefone;
}
