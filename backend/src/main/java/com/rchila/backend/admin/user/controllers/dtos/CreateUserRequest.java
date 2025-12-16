package com.rchila.backend.admin.user.controllers.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

/**
 * DTO para la solicitud de creación de usuario por un administrador.
 */
@Schema(description = "Solicitud para crear un nuevo usuario por un administrador")
public record CreateUserRequest(
                @Schema(description = "Nombre del usuario", example = "Juan") @NotBlank(message = "El nombre es obligatorio") String firstName,

                @Schema(description = "Apellido del usuario", example = "Pérez") @NotBlank(message = "El apellido es obligatorio") String lastName,

                @Schema(description = "Correo electrónico del usuario", example = "juan.perez@ejemplo.com") @NotBlank(message = "El correo electrónico es obligatorio") @Email(message = "El formato del correo electrónico no es válido") String email,

                @Schema(description = "IDs de los roles asignados al usuario", example = "[1, 2]") @NotEmpty(message = "Debe asignar al menos un rol") Set<Long> roleIds,

                @Schema(description = "Indica si se debe enviar un email de activación", example = "true", defaultValue = "true") Boolean sendActivationEmail,

                @Schema(description = "Contraseña del usuario (requerida solo si no se envía email de activación)", example = "Password123!") String password,

                @Schema(description = "Indica si el usuario debe estar activo inmediatamente", example = "true", defaultValue = "false") Boolean enabled) {

        // Constructor con valores por defecto para campos opcionales
        public CreateUserRequest {
                // Establecer valores por defecto si son null
                sendActivationEmail = sendActivationEmail != null ? sendActivationEmail : true;
                enabled = enabled != null ? enabled : false;
        }
}