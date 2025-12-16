package com.rchila.backend.model.dto;

import java.util.List;
import java.util.Set;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoPrincipalDTO {
    private Long id;
    private String numeroDocumento;
    private String nombreDocumento;
    private String descripcion;
    private String fechaEmision;
    private String urlDocumento;
    private Set<String> tagsDocumento;
    private List<ConsejeroDTO> consejeros;
    private List<ComisionDTO> comisiones;
    private String tipoDocumento;
    private String anio; 
}
