package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.StatusPedido;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/enums")
public class EnumsController {

    @GetMapping
    public Map<String, Object> listAll() {
        return Map.of(
                "etapaProducao", EtapaProducao.values(),
                "statusPedido", StatusPedido.values(),
                "tamanho", Tamanho.values(),
                "refletivo", Refletivo.values()
        );
    }
}
