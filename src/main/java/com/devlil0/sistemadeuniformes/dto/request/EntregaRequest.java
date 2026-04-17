package com.devlil0.sistemadeuniformes.dto.request;

import com.devlil0.sistemadeuniformes.enums.StatusEntrega;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EntregaRequest {

    private Long id;

    @NotNull(message = "O ID do fardo é obrigatório")
    private Long fardoId;

    @NotNull(message = "O ID do entregador é obrigatório")
    private Long entregadorId;

    @NotNull(message = "A data de entrega é obrigatória")
    private LocalDate dataEntrega;

    @NotNull(message = "O status é obrigatório")
    private StatusEntrega status;

    private String observacao;
}
