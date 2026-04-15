package com.devlil0.sistemadeuniformes.dto.response;

import lombok.Data;

@Data
public class ItemPedidoResponse {

    private Long id;
    private PedidoResponse pedidoResponse;
    private UniformeResponse uniformeResponse;
    private Long quantidade;
}
