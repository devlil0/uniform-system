package com.devlil0.sistemadeuniformes.dto.response;

import com.devlil0.sistemadeuniformes.enums.StatusPedido;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PedidoResponse {

    private Long id;
    private ClienteResponse clienteResponse;
    private LocalDateTime createdAt;
    private StatusPedido status;
}
