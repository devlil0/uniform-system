package com.devlil0.sistemadeuniformes.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Cor {

    AMARELO("Amarelo"),
    AZUL("Azul"),
    AZUL_MARINHO("Azul Marinho"),
    BRANCO("Branco"),
    CINZA("Cinza"),
    LARANJA("Laranja"),
    MARROM("Marrom"),
    NEON_LARANJA("Neon Laranja"),
    NEON_VERDE("Neon Verde"),
    PETROLEO("Petróleo"),
    PRETO("Preto"),
    ROSA("Rosa"),
    VERDE("Verde"),
    VERMELHO("Vermelho");

    private final String label;

    Cor(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static Cor fromLabel(String label) {
        for (Cor c : values()) {
            if (c.label.equalsIgnoreCase(label)) return c;
        }
        throw new IllegalArgumentException("Valor inválido para Cor: " + label);
    }
}
