package com.rchila.backend.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoDTO {
    private Long id;
    private String numeroDocumento;
    private String nombreDocumento;
    private String descripcion;
    private String fechaEmision;
    private boolean activo;
    private String urlDocumento;
    private Set<String> tagsDocumento;
    private List<DocumentoRelacionadoDTO> consejeros;
    private List<DocumentoRelacionadoDTO> comisiones;
    private DocumentoRelacionadoDTO tipoDocumento;
    private DocumentoRelacionadoDTO anio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
