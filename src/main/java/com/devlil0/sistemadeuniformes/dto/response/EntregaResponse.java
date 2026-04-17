package com.devlil0.sistemadeuniformes.dto.response;

import com.devlil0.sistemadeuniformes.enums.StatusEntrega;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EntregaResponse {

    private Long id;
    private FardoResponse fardoResponse;
    private EntregadorResponse entregadorResponse;
    private LocalDate dataEntrega;
    private StatusEntrega status;
    private String observacao;
}
