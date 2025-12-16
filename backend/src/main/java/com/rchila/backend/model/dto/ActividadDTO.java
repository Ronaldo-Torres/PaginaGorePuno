package com.rchila.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActividadDTO {
    private Long id;
    private List<NoticiaDTO> noticias;
}
