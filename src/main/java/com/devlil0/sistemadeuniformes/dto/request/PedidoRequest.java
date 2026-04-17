package com.devlil0.sistemadeuniformes.dto.request;

import com.devlil0.sistemadeuniformes.enums.StatusPedido;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoRequest {

    private Long id;

    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;

    private StatusPedido status;
}
