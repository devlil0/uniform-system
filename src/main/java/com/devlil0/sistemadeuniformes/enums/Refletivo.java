package com.devlil0.sistemadeuniformes.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Refletivo {

    CR("C/R"),
    SR("S/R");

    private final String label;

    Refletivo(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static Refletivo fromLabel(String label) {
        for (Refletivo r : values()) {
            if (r.label.equals(label)) return r;
        }
        throw new IllegalArgumentException("Valor inválido para Refletivo: " + label);
    }
}
