package com.rchila.backend.model.dto;

public record ServicioDTO(
        Long id,
        String nombre,
        String descripcion,
        String imagen,
        String url,
        String icono) {
}
