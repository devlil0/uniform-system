package com.devlil0.sistemadeuniformes.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FardoRequest {

    private Long id;

    @NotNull(message = "O ID do pedido é obrigatório")
    private Long pedidoId;

    @NotNull(message = "A data de envio é obrigatória")
    private LocalDate dataEnvio;
}
