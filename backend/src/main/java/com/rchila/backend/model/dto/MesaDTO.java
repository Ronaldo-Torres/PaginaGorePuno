package com.rchila.backend.model.dto;

public record MesaDTO(
        Long id,
        String nombre,
        String apellido,
        String dni,
        String cargo,
        String descripcion,
        String correo,
        String telefono,
        String celular,
        String direccion,
        Boolean activo,
        String provincia,
        String url_imagen,
        String documento,
        String facebook,
        String twitter,
        String instagram
        
        ) {
}
