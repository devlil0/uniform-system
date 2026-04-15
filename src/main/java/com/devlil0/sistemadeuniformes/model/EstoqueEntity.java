package com.devlil0.sistemadeuniformes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EstoqueEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quantidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uniforme_id")
    private UniformeEntity uniformeEntity;

    private boolean vinculadoCliente;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private ClienteEntity clienteEntity;
}
