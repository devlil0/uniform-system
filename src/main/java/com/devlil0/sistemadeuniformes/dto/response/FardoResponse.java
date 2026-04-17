package com.devlil0.sistemadeuniformes.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FardoResponse {

    private Long id;
    private PedidoResponse pedidoResponse;
    private LocalDate dataEnvio;
}
