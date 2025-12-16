package com.rchila.backend.model.dto;

public class DocumentoRelacionadoDTO {
    private Long id;
    private String nombre;

    // Constructor
    public DocumentoRelacionadoDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
} 