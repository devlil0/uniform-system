package com.devlil0.sistemadeuniformes.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NomeUniforme {

    AVENTAL("Avental"),
    CALCA("Calça"),
    CAMISA_MC("Camisa MC"),
    CAMISA_ML("Camisa ML"),
    CAMISETA("Camiseta"),
    JALECO_MC("Jaleco MC"),
    JALECO_ML("Jaleco ML"),
    MACACAO("Macacão"),
    POLO("Polo");

    private final String label;

    NomeUniforme(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static NomeUniforme fromLabel(String label) {
        for (NomeUniforme n : values()) {
            if (n.label.equalsIgnoreCase(label)) return n;
        }
        throw new IllegalArgumentException("Valor inválido para NomeUniforme: " + label);
    }
}
