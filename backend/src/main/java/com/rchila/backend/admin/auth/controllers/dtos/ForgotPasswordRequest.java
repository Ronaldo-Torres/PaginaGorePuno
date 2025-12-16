package com.rchila.backend.admin.auth.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Solicitud para iniciar el proceso de restablecimiento de contraseña")
public record ForgotPasswordRequest(
        @Schema(description = "Correo electrónico del usuario", example = "usuario@ejemplo.com") @NotBlank(message = "El correo electrónico es obligatorio") @Email(message = "El formato del correo electrónico no es válido") String email) {
}