package com.rchila.backend.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class NotificacionDTO {
    private Long id;
    private String mensaje;
    private String estado;
    private Long agendaId;
    private List<String> userId;

}
