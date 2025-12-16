package com.rchila.backend.model.dto;

import com.rchila.backend.model.Parametro;

import java.util.List;

public record PrincipalDTO(
                List<PortadaDTO> portadas,
                List<LinkInteresDTO> linkInteres,
                List<ServicioDTO> servicios,
                List<MesaDTO> mesaDirectiva,
                Parametro parametro) {
}