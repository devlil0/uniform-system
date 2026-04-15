package com.devlil0.sistemadeuniformes.dto.response;

import lombok.Data;

@Data
public class EstoqueResponse {

    private Long id;
    private Long quantidade;
    private UniformeResponse uniformeResponse;
    private boolean vinculadoCliente;
    private ClienteResponse clienteResponse;
}
