package com.rchila.backend.model.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class DocuemntoSyncObtenerDTO {
    private Long id;
    private String codigoEmision;
    private List<String> tags;
    private List<ConsejeroDTO> consejeros;
    private List<ComisionDTO> comisiones;
}
