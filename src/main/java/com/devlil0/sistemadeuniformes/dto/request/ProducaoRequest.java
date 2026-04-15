package com.devlil0.sistemadeuniformes.dto.request;

import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProducaoRequest {

    private Long id;

    @NotNull(message = "O ID do pedido é obrigatório")
    private Long pedidoId;

    @NotNull(message = "O ID da costureira é obrigatório")
    private Long costureiraId;

    private LocalDateTime entrada;
    private LocalDateTime saida;

    @NotNull(message = "A etapa de produção é obrigatória")
    private EtapaProducao etapa;

}
