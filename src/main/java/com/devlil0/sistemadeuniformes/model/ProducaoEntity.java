package com.devlil0.sistemadeuniformes.model;

import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ProducaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private PedidoEntity pedidoEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "costureira_id")
    private CostureiraEntity costureiraEntity;

    @CreationTimestamp
    private LocalDateTime entrada;
    private LocalDateTime saida;

    @Enumerated(EnumType.STRING)
    private EtapaProducao etapa;
}
