package com.rchila.backend.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DocumetoSyncDTO {
    private Long id;
    private String codigoEmision;
    private List<String> tags;
    private List<Integer> consejeros;
    private List<Integer> comisiones;
}
