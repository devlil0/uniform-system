package com.devlil0.sistemadeuniformes.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemPedidoRequest {

    private Long id;

    @NotNull(message = "O ID do pedido é obrigatório")
    private Long pedidoId;

    @NotNull(message = "O ID do uniforme é obrigatório")
    private Long uniformeId;

    @NotNull(message = "A quantidade é obrigatória")
    private Long quantidade;
}
