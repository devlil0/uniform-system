package com.devlil0.sistemadeuniformes.dto.response;

import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProducaoResponse {

    private Long id;
    private PedidoResponse pedidoResponse;
    private CostureiraResponse costureiraResponse;
    private LocalDateTime entrada;
    private LocalDateTime saida;
    private EtapaProducao etapa;
}
