package com.rchila.backend.admin.user.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Solicitud para cambiar la contraseña del usuario autenticado")
public record ChangePasswordRequest(
        @Schema(description = "Contraseña actual del usuario", example = "CurrentP@ssw0rd") @NotBlank(message = "La contraseña actual es obligatoria") String currentPassword,

        @Schema(description = "Nueva contraseña del usuario", example = "NewSecureP@ssw0rd") @NotBlank(message = "La nueva contraseña es obligatoria") @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String newPassword) {
}