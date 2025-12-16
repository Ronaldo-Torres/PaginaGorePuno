package com.rchila.backend.admin.email.service.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * DTO para solicitudes de envío masivo de correos.
 */
public record BulkEmailRequest(
        @NotBlank(message = "El asunto es obligatorio") @Size(max = 200, message = "El asunto no puede exceder 200 caracteres") String subject,

        @NotBlank(message = "El mensaje es obligatorio") @Size(max = 10000, message = "El mensaje no puede exceder 10,000 caracteres") String message,

        boolean isHtml,

        // Para envío a usuarios específicos por UUID
        Set<UUID> userIds,

        // Para envío a usuarios por email
        List<String> emails,

        // Para envío a todos los usuarios (dejar ambos campos anteriores vacíos)
        boolean sendToAllUsers,

        // Para filtrar por roles específicos
        Set<String> roleNames) {
}