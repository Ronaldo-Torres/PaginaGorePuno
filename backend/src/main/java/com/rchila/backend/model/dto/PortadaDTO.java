package com.rchila.backend.model.dto;

public record PortadaDTO(
        Long id,
        String titulo,
        String subtitulo,
        String descripcion,
        String nombreBoton,
        String urlBoton,
        String imagen) {
}