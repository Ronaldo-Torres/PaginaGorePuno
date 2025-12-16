package com.rchila.backend.admin.auth.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Solicitud para completar el proceso de restablecimiento de contraseña")
public record ResetPasswordRequest(
        @Schema(description = "Token de restablecimiento enviado al correo electrónico", example = "abc123xyz456") @NotBlank(message = "El token de restablecimiento es obligatorio") String token,

        @Schema(description = "Nueva contraseña del usuario", example = "NewSecureP@ssw0rd") @NotBlank(message = "La nueva contraseña es obligatoria") @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String newPassword) {
}