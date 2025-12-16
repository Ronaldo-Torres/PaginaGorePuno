package com.rchila.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import com.rchila.backend.model.Cargo;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComisionDTO {
    private Long id;
    private String nombre;
    private Cargo cargo;

}
