package com.rchila.backend.model.dto;

import com.rchila.backend.model.LinkInteres;
import com.rchila.backend.model.Servicio;
import java.time.LocalDateTime;
import java.util.List;



public record PrincipalResponseDTO(
        DatosDTO datos,
        MetadataDTO metadata) {

    public record DatosDTO(
            List<PortadaDTO> portadas,
            List<LinkInteres> linkInteres,
            List<NoticiaDTO> noticias,
            List<Servicio> servicios) {
    }

    public record MetadataDTO(
            LocalDateTime timestamp,
            int totalPortadas,
            int totalLinkInteres,
            int totalNoticias,
            int totalServicios,
            String version) {
    }
}