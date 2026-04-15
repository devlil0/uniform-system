package com.devlil0.sistemadeuniformes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ItemPedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private PedidoEntity pedidoEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uniforme_id")
    private UniformeEntity uniformeEntity;

    private Long quantidade;
}
