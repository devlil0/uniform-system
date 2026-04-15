package com.devlil0.sistemadeuniformes.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EstoqueRequest {

    @NotNull
    private Long id;

    @NotNull
    private Long quantidade;

    @NotNull
    private Long uniformeId;

    private boolean vinculadoCliente;

    @NotNull
    private Long clienteId;
}
