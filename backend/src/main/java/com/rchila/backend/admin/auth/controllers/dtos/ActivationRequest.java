package com.rchila.backend.admin.auth.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;


@Schema(description = "Solicitud para activar una cuenta de usuario")
public record ActivationRequest(
        @Schema(description = "Token de activación enviado al correo electrónico", example = "abc123xyz456") @NotBlank(message = "El token de activación es obligatorio") String token) {
}