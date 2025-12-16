package com.rchila.backend.admin.user.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Schema(description = "Solicitud para establecer una nueva contraseña")
public record SetPasswordRequest(
        @Schema(description = "Nueva contraseña", example = "Nueva_Contraseña123") @NotBlank(message = "La nueva contraseña no puede estar vacía") @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String newPassword,

        @Schema(description = "Confirmación de la nueva contraseña", example = "Nueva_Contraseña123") @NotBlank(message = "La confirmación de contraseña no puede estar vacía") String confirmPassword) {
}