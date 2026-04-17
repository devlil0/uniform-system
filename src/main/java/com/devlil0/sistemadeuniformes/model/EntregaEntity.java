package com.devlil0.sistemadeuniformes.model;

import com.devlil0.sistemadeuniformes.enums.StatusEntrega;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class EntregaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fardo_id", unique = true)
    private FardoEntity fardoEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entregador_id")
    private EntregadorEntity entregadorEntity;

    private LocalDate dataEntrega;

    @Enumerated(EnumType.STRING)
    private StatusEntrega status;

    private String observacao;
}
