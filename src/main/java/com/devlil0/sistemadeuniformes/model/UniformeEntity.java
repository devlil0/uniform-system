package com.devlil0.sistemadeuniformes.model;

import com.devlil0.sistemadeuniformes.enums.Cor;
import com.devlil0.sistemadeuniformes.enums.Malha;
import com.devlil0.sistemadeuniformes.enums.NomeUniforme;
import com.devlil0.sistemadeuniformes.enums.Refletivo;
import com.devlil0.sistemadeuniformes.enums.Tamanho;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UniformeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private NomeUniforme nome;

    @Enumerated(EnumType.STRING)
    private Malha malha;

    @Enumerated(EnumType.STRING)
    private Tamanho tamanho;

    @Enumerated(EnumType.STRING)
    private Refletivo refletivo;

    @Enumerated(EnumType.STRING)
    private Cor cor;
}
